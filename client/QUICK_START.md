# HRMS - Complete Setup Guide

## 🚀 Quick Start (Both Frontend & Backend)

This guide will help you set up the complete HRMS application with both backend and frontend.

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🛠️ Installation Steps

### Step 1: Setup Backend

```bash
# Navigate to backend directory
cd hrms-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hrms_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@hrms.com
EOL

# Start MongoDB (if not running)
# Windows: mongod
# Mac/Linux: sudo systemctl start mongod

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 2: Create Admin User

**Option A: Using Node.js Script**

Create a file `createAdmin.js` in backend directory:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    const admin = await User.create({
      email: 'admin@hrms.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });
    console.log('✅ Admin created successfully!');
    console.log('Email:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
```

Run it:
```bash
node createAdmin.js
```

**Option B: Using MongoDB Shell**

```bash
mongosh
use hrms_db
db.users.insertOne({
  email: "admin@hrms.com",
  password: "$2a$10$8qVW8J7eoKGPLvxZ7v9W7.VhR9p0u7Kx4vN6qQzB9YzMJ7F8L9K5a",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Step 3: Setup Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd hrms-frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start frontend server
npm run dev
```

Frontend will run on: `http://localhost:3000`

## 🎯 Access the Application

1. Open your browser
2. Go to `http://localhost:3000`
3. Login with default credentials:
   - **Email**: `admin@hrms.com`
   - **Password**: `admin123`

## 📝 First Steps After Login

### 1. Create an Employee

- Click on **Employees** in the sidebar
- Click **Add Employee** button
- Fill in the form:
  ```
  First Name: John
  Last Name: Doe
  Email: john.doe@company.com
  Phone: +1234567890
  Department: Engineering
  Position: Software Engineer
  Salary: 75000
  Hire Date: 2024-01-15
  ```
- Click **Create Employee**

### 2. Create User Account for Employee

- Go to backend and run this script or use Postman:

```javascript
// createUser.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Employee = require('./src/models/Employee');

mongoose.connect(process.env.MONGODB_URI);

const createUser = async () => {
  try {
    const employee = await Employee.findOne({ email: 'john.doe@company.com' });
    
    if (!employee) {
      console.log('❌ Employee not found');
      process.exit(1);
    }

    const user = await User.create({
      email: 'john.doe@company.com',
      password: 'employee123',
      role: 'employee',
      employee: employee._id,
      isActive: true
    });

    employee.user = user._id;
    await employee.save();

    console.log('✅ User created successfully!');
    console.log('Email:', user.email);
    console.log('Password: employee123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createUser();
```

### 3. Test Employee Features

- Logout from admin account
- Login as employee:
  - **Email**: `john.doe@company.com`
  - **Password**: `employee123`
- Test features:
  - Check-in attendance
  - Apply for leave
  - View profile

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# Mac/Linux:
sudo systemctl status mongod
sudo systemctl start mongod
```

**Port Already in Use:**
```bash
# Change PORT in backend .env file
PORT=5001
```

**Dependencies Error:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Cannot Connect to Backend:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Check browser console for CORS errors

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite package-lock.json
npm install
npm run dev
```

**Login Not Working:**
- Check Network tab in browser DevTools
- Verify backend is responding
- Check credentials are correct

## 📊 Testing the Complete System

### 1. Admin Workflow
```
✓ Login as admin
✓ Create employees
✓ View dashboard statistics
✓ Monitor all attendance
✓ Approve/reject leaves
✓ Manage performance reviews
```

### 2. Employee Workflow
```
✓ Login as employee
✓ Check-in for attendance
✓ Apply for leave
✓ Check leave balance
✓ View performance reviews
✓ Update profile
✓ Change password
```

### 3. HR Manager Workflow
```
✓ Login as HR manager
✓ Manage employees
✓ Monitor attendance
✓ Approve leaves
✓ Create performance reviews
```

## 🌐 API Testing with Postman/Thunder Client

### Import Collection

Create a Postman collection with these endpoints:

**Base URL**: `http://localhost:5000/api`

1. **Login**
   - POST `/auth/login`
   - Body: `{ "email": "admin@hrms.com", "password": "admin123" }`

2. **Get Employees**
   - GET `/employees`
   - Headers: `Authorization: Bearer {token}`

3. **Check-in**
   - POST `/attendance/checkin`
   - Headers: `Authorization: Bearer {token}`

4. **Apply Leave**
   - POST `/leaves`
   - Headers: `Authorization: Bearer {token}`
   - Body: `{ "leaveType": "annual", "startDate": "2024-12-20", "endDate": "2024-12-25", "reason": "Vacation" }`

## 📱 Mobile Testing

The application is fully responsive. Test on:
- Chrome DevTools (F12 > Toggle Device Toolbar)
- Actual mobile devices
- Tablet devices

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use strong passwords
- [ ] Enable HTTPS in production
- [ ] Set up MongoDB authentication
- [ ] Configure CORS properly
- [ ] Use environment-specific configs

## 🚀 Production Deployment

### Backend (Heroku Example)

```bash
cd hrms-backend
heroku create your-hrms-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Frontend (Vercel Example)

```bash
cd hrms-frontend
npm run build
vercel --prod
```

Update frontend .env:
```env
VITE_API_URL=https://your-hrms-api.herokuapp.com/api
```

## 📞 Need Help?

Common commands for reference:

```bash
# Check if services are running
lsof -i :5000  # Check backend port
lsof -i :3000  # Check frontend port

# View MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Test backend health
curl http://localhost:5000/health

# Check Node version
node --version

# Check npm version
npm --version
```

## 🎉 Success!

If you've reached here, you should have:
- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ MongoDB connected
- ✅ Admin user created
- ✅ Able to login and use the system

## 📚 Next Steps

1. Explore all features
2. Create more employees
3. Test different user roles
4. Customize the application
5. Add your company branding
6. Configure email settings
7. Set up automated backups

---

**Congratulations! Your HRMS is ready to use! 🎊**
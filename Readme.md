# HRMS Backend API

A comprehensive Human Resource Management System backend built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, HR Manager, Employee)
- **User Management**: Complete CRUD operations for users with role assignments
- **Employee Management**: Comprehensive employee profiles with personal and employment details
- **Attendance Management**: Daily check-in/check-out with automatic work hours calculation
- **Leave Management**: Apply, approve, reject leaves with balance tracking
- **Performance Management**: Employee performance reviews with ratings and feedback

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hrms-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory and add:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hrms_db
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@hrms.com
```

4. **Start MongoDB**
```bash
mongod
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User (Admin Only)
```http
POST /api/auth/register
Authorization: Bearer {token}

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "employee",
  "employeeId": "employee_object_id" (optional)
}
```

#### Login
```http
POST /api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "employee"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Update Password
```http
PUT /api/auth/update-password
Authorization: Bearer {token}

Body:
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### User Management (Admin Only)

#### Get All Users
```http
GET /api/users?role=employee&page=1&limit=10
Authorization: Bearer {token}
```

#### Get Single User
```http
GET /api/users/:id
Authorization: Bearer {token}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer {token}

Body:
{
  "email": "newemail@example.com",
  "role": "hr_manager",
  "isActive": true
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

#### Deactivate/Activate User
```http
PUT /api/users/:id/deactivate
PUT /api/users/:id/activate
Authorization: Bearer {token}
```

### Employee Management

#### Get All Employees
```http
GET /api/employees?department=IT&status=active&page=1&limit=10
Authorization: Bearer {token}
```

#### Create Employee (HR/Admin)
```http
POST /api/employees
Authorization: Bearer {token}

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "department": "IT",
  "position": "Software Engineer",
  "salary": 75000,
  "hireDate": "2024-01-01",
  "employmentType": "full-time"
}
```

#### Get Single Employee
```http
GET /api/employees/:id
Authorization: Bearer {token}
```

#### Update Employee (HR/Admin)
```http
PUT /api/employees/:id
Authorization: Bearer {token}
```

#### Delete Employee (Admin)
```http
DELETE /api/employees/:id
Authorization: Bearer {token}
```

#### Get My Profile
```http
GET /api/employees/me/profile
Authorization: Bearer {token}
```

#### Update My Profile
```http
PUT /api/employees/me/profile
Authorization: Bearer {token}

Body:
{
  "phone": "+1234567890",
  "address": {...},
  "emergencyContact": {...}
}
```

#### Get Employee Statistics
```http
GET /api/employees/stats/overview
Authorization: Bearer {token}
```

### Attendance Management

#### Check In
```http
POST /api/attendance/checkin
Authorization: Bearer {token}

Body:
{
  "location": {
    "checkIn": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Main St, New York"
    }
  }
}
```

#### Check Out
```http
PUT /api/attendance/checkout
Authorization: Bearer {token}

Body:
{
  "location": {
    "checkOut": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "address": "123 Main St, New York"
    }
  }
}
```

#### Get My Attendance
```http
GET /api/attendance/my-records?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer {token}
```

#### Get All Attendance (HR/Admin)
```http
GET /api/attendance?employeeId=xxx&status=present&page=1&limit=10
Authorization: Bearer {token}
```

#### Get Employee Attendance (HR/Admin)
```http
GET /api/attendance/employee/:employeeId?startDate=2024-01-01
Authorization: Bearer {token}
```

#### Get Attendance Summary (HR/Admin)
```http
GET /api/attendance/summary/stats?month=1&year=2024
Authorization: Bearer {token}
```

### Leave Management

#### Apply for Leave
```http
POST /api/leaves
Authorization: Bearer {token}

Body:
{
  "leaveType": "annual",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "reason": "Family vacation"
}
```

#### Get My Leaves
```http
GET /api/leaves/my-leaves?status=pending
Authorization: Bearer {token}
```

#### Get Leave Balance
```http
GET /api/leaves/balance
Authorization: Bearer {token}
```

#### Get All Leaves (HR/Admin)
```http
GET /api/leaves?status=pending&leaveType=annual
Authorization: Bearer {token}
```

#### Approve Leave (HR/Admin)
```http
PUT /api/leaves/:id/approve
Authorization: Bearer {token}
```

#### Reject Leave (HR/Admin)
```http
PUT /api/leaves/:id/reject
Authorization: Bearer {token}

Body:
{
  "rejectionReason": "Insufficient coverage during requested period"
}
```

#### Cancel Leave
```http
PUT /api/leaves/:id/cancel
Authorization: Bearer {token}
```

### Performance Management

#### Create Performance Review (HR/Admin)
```http
POST /api/performance
Authorization: Bearer {token}

Body:
{
  "employee": "employee_id",
  "reviewPeriod": {
    "startDate": "2024-01-01",
    "endDate": "2024-03-31"
  },
  "reviewType": "quarterly",
  "ratings": {
    "quality": 4,
    "productivity": 5,
    "communication": 4,
    "teamwork": 5,
    "leadership": 3,
    "punctuality": 5
  },
  "strengths": "Excellent technical skills and teamwork",
  "areasForImprovement": "Leadership skills need development",
  "feedback": "Great performance overall",
  "goals": [
    {
      "title": "Complete certification",
      "description": "Obtain AWS certification",
      "deadline": "2024-06-30",
      "status": "in-progress"
    }
  ]
}
```

#### Get My Performance Reviews
```http
GET /api/performance/my-reviews
Authorization: Bearer {token}
```

#### Get All Performance Reviews (HR/Admin)
```http
GET /api/performance?employeeId=xxx&reviewType=quarterly
Authorization: Bearer {token}
```

#### Get Single Performance Review
```http
GET /api/performance/:id
Authorization: Bearer {token}
```

#### Update Performance Review (HR/Admin)
```http
PUT /api/performance/:id
Authorization: Bearer {token}
```

#### Submit Review (HR/Admin)
```http
PUT /api/performance/:id/submit
Authorization: Bearer {token}
```

#### Acknowledge Review (Employee)
```http
PUT /api/performance/:id/acknowledge
Authorization: Bearer {token}

Body:
{
  "employeeComments": "Thank you for the feedback. I will work on the areas mentioned."
}
```

#### Get Employee Performance Stats (HR/Admin)
```http
GET /api/performance/employee/:employeeId/stats
Authorization: Bearer {token}
```

## 🔐 Role-Based Access Control

### Admin
- Full access to all resources
- User management
- System configuration

### HR Manager
- Employee management
- Attendance management
- Leave approval/rejection
- Performance reviews

### Employee
- View and edit own profile
- Check-in/check-out
- Apply for leaves
- View own attendance and performance reviews

## 📊 Data Models

### User
- email, password, role, isActive, employee (reference)

### Employee
- Personal details (name, email, phone, DOB, gender, address)
- Employment details (department, position, salary, hire date)
- Leave balance
- Emergency contact
- Bank details

### Attendance
- employee, date, checkIn, checkOut, status, workHours, overtime, location

### Leave
- employee, leaveType, startDate, endDate, numberOfDays, reason, status, approvedBy

### Performance
- employee, reviewPeriod, reviewType, reviewer, ratings, goals, achievements, feedback

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based authorization
- Password change detection
- Account activation/deactivation

## 📧 Email Notifications

- Welcome emails for new users
- Leave status updates
- Password reset (optional)

## 🚦 Error Handling

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🧪 Testing

Use tools like Postman or Thunder Client to test the API endpoints.

### Sample Admin Login
```json
{
  "email": "admin@hrms.com",
  "password": "admin123"
}
```

## 📝 Notes

- All dates should be in ISO 8601 format
- Pagination is available on list endpoints (page, limit)
- All protected routes require `Authorization: Bearer {token}` header
- File uploads are configured but implementation depends on your requirements

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

For support, email support@hrms.com or create an issue in the repository.
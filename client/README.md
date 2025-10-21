# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


# HRMS Frontend - React + Vite

A modern, responsive Human Resource Management System frontend built with React and Vite.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive interface with custom CSS styling
- **Role-Based Access**: Different views for Admin, HR Manager, and Employee roles
- **Dashboard**: Overview with statistics and quick actions
- **Employee Management**: Full CRUD operations for employees (Admin/HR only)
- **Attendance Tracking**: Check-in/check-out with attendance history
- **Leave Management**: Apply, approve, and track leaves
- **Performance Reviews**: View and manage performance evaluations
- **Profile Management**: Update personal information and change password
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Running backend server (see backend README)

## 🛠️ Installation

1. **Navigate to the frontend directory**
```bash
cd hrms-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server**
```bash
npm run dev
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
hrms-frontend/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable components
│   │   └── common/       # Common UI components
│   ├── context/          # React Context (Auth)
│   ├── pages/            # Page components
│   ├── routes/           # Routing configuration
│   ├── services/         # API service layer
│   ├── App.jsx           # Main App component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Public assets
├── .env                  # Environment variables
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.js        # Vite configuration
└── README.md
```

## 🎨 Components Overview

### Common Components
- **Button**: Reusable button with variants (primary, secondary, danger, ghost, outline)
- **Card**: Container component with optional title and actions
- **Input**: Form input with label and error handling
- **Select**: Dropdown select component
- **TextArea**: Multi-line text input
- **Modal**: Modal dialog component
- **Table**: Data table with customizable columns
- **Loader**: Loading spinner (with fullscreen option)
- **Alert**: Notification alerts (success, error, warning, info)
- **Navbar**: Top navigation bar
- **Sidebar**: Side navigation menu

### Pages
- **Login**: User authentication
- **Dashboard**: Overview and statistics
- **Employees**: Employee management (Admin/HR)
- **Attendance**: Attendance tracking
- **Leaves**: Leave management
- **Performance**: Performance reviews
- **Profile**: User profile and settings

## 🔐 Authentication

The application uses JWT token-based authentication:

1. User logs in with email and password
2. Backend returns JWT token
3. Token is stored in localStorage
4. Token is attached to all API requests via axios interceptor
5. Automatic logout on token expiration (401 response)

### Default Credentials

**Admin:**
- Email: `admin@hrms.com`
- Password: `admin123`

## 🎯 Role-Based Features

### Admin
- Full access to all features
- Employee management (create, update, delete)
- User management
- Leave approval/rejection
- Performance review management
- System-wide statistics

### HR Manager
- Employee management (create, update)
- Attendance monitoring
- Leave approval/rejection
- Performance review management
- Department statistics

### Employee
- View own profile
- Check-in/check-out attendance
- Apply for leaves
- View leave history and balance
- View performance reviews
- Update personal information

## 🎨 Styling

The application uses custom CSS with CSS variables for theming:

### Color Palette
- Primary: `#4f46e5` (Indigo)
- Secondary: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Warning: `#f59e0b` (Amber)
- Info: `#3b82f6` (Blue)

### CSS Variables
All colors, spacing, and other design tokens are defined in `src/index.css` using CSS custom properties.

### Responsive Design
- Desktop: > 768px
- Mobile: < 768px
- Flexible grid layouts
- Mobile-friendly navigation

## 📡 API Integration

All API calls are handled through service modules in `src/services/`:

- **authService**: Authentication operations
- **employeeService**: Employee CRUD operations
- **attendanceService**: Attendance management
- **leaveService**: Leave management
- **performanceService**: Performance reviews

### API Configuration

The base API URL is configured in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Axios Interceptors

**Request Interceptor**: Automatically adds JWT token to headers
```javascript
Authorization: Bearer {token}
```

**Response Interceptor**: Handles 401 errors (logout on token expiration)

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Features by Page

### Dashboard
- Welcome message
- Statistics cards (Admin/HR only)
- Today's attendance status
- Quick links to main features
- Department distribution

### Employees (Admin/HR only)
- Employee list with search and filters
- Add new employee
- Edit employee details
- Delete employee
- View employee statistics

### Attendance
- Check-in button (morning)
- Check-out button (evening)
- Attendance history table
- Work hours calculation
- Status badges

### Leaves
- Leave balance display
- Apply for leave form
- Leave history table
- Approve/reject actions (Admin/HR)
- Status tracking (pending, approved, rejected)

### Performance
- Performance review list
- Rating display (1-5 stars)
- Review period information
- Status tracking

### Profile
- Personal information display
- Edit phone number
- Change password
- Employment details
- Account status

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Deployment Options

1. **Vercel**
```bash
npm install -g vercel
vercel
```

2. **Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

3. **GitHub Pages**
- Build the project
- Deploy the `dist/` folder

4. **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Environment Variables for Production

Update `.env` for production:
```env
VITE_API_URL=https://your-production-api.com/api
```

## 🔒 Security Best Practices

1. **Token Storage**: JWT tokens stored in localStorage
2. **Automatic Logout**: On token expiration or 401 errors
3. **Protected Routes**: All routes except login require authentication
4. **Role Checks**: Components check user roles before rendering
5. **Input Validation**: Form validation on client side
6. **XSS Prevention**: React automatically escapes content

## 🐛 Troubleshooting

### Issue: Cannot connect to backend
**Solution**: Ensure backend is running on port 5000 and VITE_API_URL is correct

### Issue: Login fails
**Solution**: 
- Check network tab for API response
- Verify credentials
- Ensure backend is running

### Issue: 401 Unauthorized
**Solution**: 
- Token may have expired
- Try logging out and logging in again
- Check token in localStorage

### Issue: Styles not loading
**Solution**:
- Clear browser cache
- Rebuild the project: `npm run build`
- Check console for CSS errors

## 📈 Performance Optimization

1. **Code Splitting**: React.lazy() for route-based splitting
2. **Image Optimization**: Use WebP format when possible
3. **Caching**: Service workers for offline capability
4. **Minification**: Vite automatically minifies in production
5. **Tree Shaking**: Unused code is removed in production build

## 🧪 Testing

To add testing:

```bash
# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Add test script to package.json
"test": "vitest"

# Run tests
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔮 Future Enhancements

- [ ] File upload for employee photos
- [ ] Export data to Excel/PDF
- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Advanced search and filters
- [ ] Data visualization charts
- [ ] Email notifications
- [ ] Document management
- [ ] Payroll integration
- [ ] Calendar view for leaves

## 📞 Support

For issues or questions:
- Check the documentation
- Review console errors
- Verify API connectivity
- Check backend logs

## 📝 License

This project is licensed under the ISC License.

## 👥 Credits

Built with:
- React 18
- Vite 5
- React Router 6
- Axios
- Custom CSS

---

**Happy Coding! 🎉**
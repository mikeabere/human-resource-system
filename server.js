import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import morgan from "morgan"; //http status logger
import cors from "cors";
import connectDB from "./config/db.js";
connectDB();

app.use(cors());
app.use(express.json());// express middleware
app.use(express.urlencoded({ extended: true }));

// Import Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import employeeRoutes from './routes/employee.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRoutes from './routes/leave.js';
import performanceRoutes from './routes/performance.js';

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/performance', performanceRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}





const port = process.env.PORT || 5500;



  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });


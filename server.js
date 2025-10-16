import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import morgan from "morgan";
import cors from "cors";
import connectDB from "./config/db.js";
connectDB();

// Import Routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import employeeRoutes from './routes/employee.js';
import attendanceRoutes from './routes/attendance.js';
import leaveRoutes from './routes/leave.js';
import performanceRoutes from './routes/performance.js';

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/performance', performanceRoutes);

//middleware
// import { authenticateUser } from "./middleware/authMiddleware.js";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api/v1/jobs", authenticateUser, jobRouter);
// app.use("/api/v1/users", authenticateUser, userRouter);
// app.use("/api/v1/auth", authRouter);

const port = process.env.PORT || 5500;



  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });


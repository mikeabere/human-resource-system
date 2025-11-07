import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/UserModel.js";
import Employee from "./models/EmployeeModel.js";

mongoose.connect(process.env.MONGO_URL);

const createUser = async () => {
  try {
    const employee = await Employee.findOne({ email: "john.doe@company.com" });

    if (!employee) {
      console.log("❌ Employee not found");
      process.exit(1);
    }

    const user = await User.create({
      email: "john.doe@company.com",
      password: "employee123",
      role: "employee",
      employee: employee._id,
      isActive: true,
    });

    employee.user = user._id;
    await employee.save();

    console.log("✅ User created successfully!");
    console.log("Email:", user.email);
    console.log("Password: employee123");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createUser();

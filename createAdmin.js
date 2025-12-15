import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/UserModel.js";


mongoose.connect(process.env.MONGO_URL);

const createAdmin = async () => {
  try {
    const admin = await User.create({
      email: "admin@hrms.com",
      password: "admin123", //file should be removed before production
      role: "admin",
      isActive: true,
    });
    console.log("✅ Admin created successfully!");
    console.log("Email:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();

import express from "express";
const router = express.Router();
import {
  register,
  login,
  getMe,
  logout,
  updatePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

// Public routes
router.post("/login", login);

// Protected routes
router.post("/register", protect, isAdmin, register);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/update-password", protect, updatePassword);

export default router;

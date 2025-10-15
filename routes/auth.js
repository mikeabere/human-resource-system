const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  updatePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

// Public routes
router.post("/login", login);

// Protected routes
router.post("/register", protect, isAdmin, register);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/update-password", protect, updatePassword);

module.exports = router;

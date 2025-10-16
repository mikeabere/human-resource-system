import express from "express";
const router = express.Router();
import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getEmployeeAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceSummary,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";
import { isHROrAdmin, isAdmin } from "../middleware/roleCheck.js";

// All routes are protected
router.use(protect);

// Employee routes
router.post("/checkin", checkIn);
router.put("/checkout", checkOut);
router.get("/my-records", getMyAttendance);

// HR/Admin routes
router.get("/", isHROrAdmin, getAllAttendance);
router.get("/summary/stats", isHROrAdmin, getAttendanceSummary);
router.get("/employee/:employeeId", isHROrAdmin, getEmployeeAttendance);

router
  .route("/:id")
  .put(isHROrAdmin, updateAttendance)
  .delete(isAdmin, deleteAttendance);

export default router;

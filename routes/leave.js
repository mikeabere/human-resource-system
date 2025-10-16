import express from "express";
const router = express.Router();
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  getLeaveBalance,
} from "../controllers/leaveController.js";
import { protect } from "../middleware/auth.js";
import { isHROrAdmin } from "../middleware/roleCheck.js";

// All routes are protected
router.use(protect);

// Employee routes
router.post("/", applyLeave);
router.get("/my-leaves", getMyLeaves);
router.get("/balance", getLeaveBalance);
router.put("/:id/cancel", cancelLeave);

// HR/Admin routes
router.get("/", isHROrAdmin, getAllLeaves);
router.get("/:id", getLeave);
router.put("/:id/approve", isHROrAdmin, approveLeave);
router.put("/:id/reject", isHROrAdmin, rejectLeave);

export default router;

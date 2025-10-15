const express = require("express");
const router = express.Router();
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  getLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  getLeaveBalance,
} = require("../controllers/leaveController");
const { protect } = require("../middleware/auth");
const { isHROrAdmin } = require("../middleware/roleCheck");

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

module.exports = router;

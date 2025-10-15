const express = require("express");
const router = express.Router();
const {
  createPerformanceReview,
  getAllPerformanceReviews,
  getMyPerformanceReviews,
  getPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
  acknowledgeReview,
  submitReview,
  getEmployeePerformanceStats,
} = require("../controllers/performanceController");
const { protect } = require("../middleware/auth");
const { isHROrAdmin, isAdmin } = require("../middleware/roleCheck");

// All routes are protected
router.use(protect);

// Employee routes
router.get("/my-reviews", getMyPerformanceReviews);
router.put("/:id/acknowledge", acknowledgeReview);

// HR/Admin routes
router.post("/", isHROrAdmin, createPerformanceReview);
router.get("/", isHROrAdmin, getAllPerformanceReviews);
router.get(
  "/employee/:employeeId/stats",
  isHROrAdmin,
  getEmployeePerformanceStats
);
router.put("/:id/submit", isHROrAdmin, submitReview);

router
  .route("/:id")
  .get(getPerformanceReview)
  .put(isHROrAdmin, updatePerformanceReview)
  .delete(isAdmin, deletePerformanceReview);

module.exports = router;

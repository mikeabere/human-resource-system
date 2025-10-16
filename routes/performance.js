import express from "express";
const router = express.Router();
import {
  createPerformanceReview,
  getAllPerformanceReviews,
  getMyPerformanceReviews,
  getPerformanceReview,
  updatePerformanceReview,
  deletePerformanceReview,
  acknowledgeReview,
  submitReview,
  getEmployeePerformanceStats,
} from "../controllers/performanceController.js";
import { protect } from "../middleware/auth.js";
import { isHROrAdmin, isAdmin } from "../middleware/roleCheck.js";

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

export default router;

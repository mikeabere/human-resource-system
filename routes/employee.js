import express from "express";
const router = express.Router();
import {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  getMyProfile,
  updateMyProfile,
} from "../controllers/employeeController.js";
import { protect } from "../middleware/auth.js";
import { isHROrAdmin } from "../middleware/roleCheck.js";

// All routes are protected
router.use(protect);

// Employee can access their own profile
router.get("/me/profile", getMyProfile);
router.put("/me/profile", updateMyProfile);

// HR/Admin routes
router.get("/stats/overview", isHROrAdmin, getEmployeeStats);

router.route("/").get(getEmployees).post(isHROrAdmin, createEmployee);

router
  .route("/:id")
  .get(getEmployee)
  .put(isHROrAdmin, updateEmployee)
  .delete(isHROrAdmin, deleteEmployee);

export default router;

const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeStats,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/employeeController");
const { protect } = require("../middleware/auth");
const { isHROrAdmin } = require("../middleware/roleCheck");

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

module.exports = router;

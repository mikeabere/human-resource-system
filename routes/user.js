const express = require("express");
const router = express.Router();
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const { isAdmin } = require("../middleware/roleCheck");

// All routes are protected and require admin access
router.use(protect);
router.use(isAdmin);

router.route("/").get(getUsers);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.put("/:id/deactivate", deactivateUser);
router.put("/:id/activate", activateUser);

module.exports = router;

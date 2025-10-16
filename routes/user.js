import express from "express";
const router = express.Router();
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { isAdmin } from "../middleware/roleCheck.js";

// All routes are protected and require admin access
router.use(protect);
router.use(isAdmin);

router.route("/").get(getUsers);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.put("/:id/deactivate", deactivateUser);
router.put("/:id/activate", activateUser);

export default router;

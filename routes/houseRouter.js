import { Router } from "express";
const router = Router();

import {
  getAllHouses,
  getHouse,
  createHouse,
  updateHouse,
  deleteHouse,
} from "../controllers/houseController.js";
import {
  validateHouseInput,
  validateIdParam,
} from "../middleware/validationMiddleware.js";

// router.get('/', getAllJobs);
// router.post('/', createJob);

router.route("/").get(getAllHouses).post(validateHouseInput, createHouse);
router
  .route("/:id")
  .get(validateIdParam, getHouse)
  .patch(validateHouseInput, validateIdParam, updateHouse)
  .delete(validateIdParam, deleteHouse);

export default router;

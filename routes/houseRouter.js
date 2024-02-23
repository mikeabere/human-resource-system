import { Router } from "express";
const router = Router();

import {
  getAllHouses,
  getHouse,
  createHouse,
  updateHouse,
  deleteHouse,
} from "../controllers/houseController.js";

// router.get('/', getAllJobs);
// router.post('/', createJob);

router.route("/").get(getAllHouses).post( createHouse);
router
  .route("/:id")
  .get( getHouse)
  .patch( updateHouse)
  .delete( deleteHouse);

export default router;

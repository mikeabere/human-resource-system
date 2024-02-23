import mongoose from "mongoose";
import { HOUSE_STATUS, HOUSE_TYPE } from "../utils/constants.js";

const HouseSchema = new mongoose.Schema(
  {
    houseName: String,
    houseID: String,
    houseStatus: {
      type: String,
      enum: Object.values(HOUSE_STATUS),
      default: HOUSE_STATUS.UN_OCCUPIED,
    },
    houseType: {
      type: String,
      enum: Object.values(HOUSE_TYPE),
      default: HOUSE_TYPE.APARTMENT,
    },
    houseLocation: {
      type: String,
      default: "Nairobi",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("House", HouseSchema);

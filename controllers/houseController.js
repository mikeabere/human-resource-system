import House from "../models/house.js";
import { StatusCodes } from "http-status-codes";

export const getAllHouses = async (req, res) => {
  const houses = await House.find({ });
  res.status(StatusCodes.OK).json({ houses });
};

export const createHouse = async (req, res) => {
  //req.body.createdBy = req.user.userId;
  const house = await House.create(req.body);
  res.status(StatusCodes.CREATED).json({ house });
};

export const getHouse = async (req, res) => {
  const house = await House.findById(req.params.id);

  res.status(StatusCodes.OK).json({ house });
};

export const updateHouse = async (req, res) => {
  const updatedHouse = await House.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ msg: "house modified", job: updatedHouse });
};

export const deleteHouse = async (req, res) => {
  const removedHouse = await House.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ msg: "house deleted", house: removedHouse });
};

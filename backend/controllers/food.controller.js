import e from "express";
import Food from "../models/food.model.js";
import fs from "fs";
import { StatusCodes } from "http-status-codes";

// add food item
const addFood = async (req, res) => {
  const { name, description, price, category } = req.body;
  const image_filename = req.file.filename;

  try {
    const food = new Food({
      name,
      description,
      price,
      image : image_filename,
      category,
    });

    await food.save();
    res.status(StatusCodes.CREATED).json({ success: true, food });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
};
export { addFood };

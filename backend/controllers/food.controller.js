import e from "express";
import Food from "../models/food.model.js";
import fs from "fs";
import { StatusCodes } from "http-status-codes";

// add food item
const addFood = async (req, res) => {
  const { name, description, price, category } = req.body;
  const image_filename = req.file?.filename;

  // check if all fields are filled
  if (!name || !description || !price || !category || !image_filename) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please fill all fields" });
  }

  try {
    const food = new Food({
      name,
      description,
      price,
      image : image_filename,
      category,
    });

    await food.save();
    res.status(StatusCodes.CREATED).json({ success: true, food, message: "Food added successfully!" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
};

// all food list
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(StatusCodes.OK).json({ success: true, foods });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
};

// remove food item
const removeFood = async (req, res) => {

  try {
    const food = await Food.findOne({ _id: req.params.id });
    if (!food) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Food not found" });
    }
    // check file exists then remove
    if (fs.existsSync(`uploads/${food.image}`)) {
      // remove image from uploads folder
      fs.unlinkSync(`uploads/${food.image}`);
    }

    await Food.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json({ success: true, message: "Food removed successfully!" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
}
export { addFood, getFoods, removeFood };

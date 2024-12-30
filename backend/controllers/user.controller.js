import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import { StatusCodes } from "http-status-codes";

// register user
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // check if all fields are filled
  if (!name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please fill all fields" });
  }

  // check if email is valid
  if (!validator.isEmail(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid email" });
  }

  if (password.length < 8) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Password must be at least 6 characters" });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // create token
    const token = createToken(newUser._id);
    res.status(StatusCodes.CREATED).json({ success: true, message: "User registered successfully!", token });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// login user
const login = async (req, res) => {
  const { email, password } = req.body;

  // check if all fields are filled
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please fill all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(user._id);
    res.status(StatusCodes.OK).json({ success: true, token });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
  }
};

export { register, login };




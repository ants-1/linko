import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").exec();

    if (!users) {
      return res.status(404).json({ message: "No users found." });
    }

    return res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password").exec();

    if (!user) {
      return res.status(404).json({ message: `User with ${id} not found.` });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

const updateUserData = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const { id } = req.params;
    const updatedUser = { name, email };
    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Error while updating user data." });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};


export default {
  getAllUsers,
  getUserById,
  updateUserData,
};
import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";

// @desc    Get all users
// @route   GET /api/v1/users
const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const users = await userModel.find().select("-password").exec();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    return res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get all user
// @route   GET /api/v1/users/:userId
const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId).select("-password").exec();

    if (!user) {
      return res.status(404).json({ error: "No user found." });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

// @desc    Update existing user's data
// @route   PUT /api/v1/users/:userId
const updateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, updates } = req.body;

    const user = await userModel.findById(userId).select("-password").exec();

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if (updates.password) {
      delete updates.password;
    }

    Object.assign(user, updates);
    await user.save();

    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

// @desc    Update existing user's password
// @route   PUT /api/v1/users/:userId/password
const updateUserPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password || "");
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    return next(err);
  }
};

export default {
  getUsers,
  getUser,
  updateUserData,
  updateUserPassword,
};

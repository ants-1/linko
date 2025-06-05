import { NextFunction, Request, Response } from "express";
import userModel from "../models/userModel";
import mongoose from "mongoose";

// @desc    Toggle follow
// @route   PUT /api/v1/follows/toggle
const toggleFollow = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { currentUserId, targetUserId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: "Invalid user ID(s)." });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }

    const currentUser = await userModel.findById(currentUserId);
    const targetUser = await userModel.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User(s) not found." });
    }

    const isFollowing = currentUser.following?.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following?.filter(
        (id) => !id.equals(targetUser._id)
      );
      targetUser.followers = targetUser.followers?.filter(
        (id) => !id.equals(currentUser._id)
      );
    } else {
      // Follow
      currentUser.following?.push(targetUser._id);
      targetUser.followers?.push(currentUser._id);
    }

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      following: currentUser.following,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get all followers for a user
// @route   GET /api/v1/users/:userId/followers
const getFollowers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;

    const user = await userModel
      .findById(userId)
      .populate("followers", "username avatarUrl")
      .select("followers");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ followers: user.followers });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get all followings for a user
// @route   GET /api/v1/users/:userId/followings
const getFollowing = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;

    const user = await userModel
      .findById(userId)
      .populate("following", "username avatarUrl")
      .select("following");

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ following: user.following });
  } catch (err) {
    return next(err);
  }
};

export default {
  toggleFollow,
  getFollowers,
  getFollowing,
};

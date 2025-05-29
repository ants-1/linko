import { NextFunction, Request, Response } from "express";
import likeModel from "../models/likeModel";
import postModel from "../models/postModel";
import dislikeModel from "../models/dislikeModel";

// @desc    Get like count for a post
// @route   GET /api/v1/likes/:postId
const getLikeCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { postId } = req.params;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const likeCount = await likeModel.countDocuments({ postId });
    return res.status(200).json({ postId, likeCount });
  } catch (err) {
    return next(err);
  }
};

// @desc    Toggle like status
// @route   POST /api/v1/likes
const toggleLikes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId, postId } = req.body;

    const post = await postModel.findById(postId);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const existingLike = await likeModel.findOne({ userId, postId });

    if (existingLike) {
      await likeModel.deleteOne({ _id: existingLike._id });
      return res.status(200).json({ message: "Like removed." });
    } else {
      // Remove existing dislike before adding a like
      await dislikeModel.deleteOne({ userId, postId });
      await likeModel.create({ userId, postId });
      return res.status(201).json({ message: "Like added. Any existing dislike was removed." });
    }
  } catch (err) {
    return next(err);
  }
};

export default {
  getLikeCount,
  toggleLikes
};

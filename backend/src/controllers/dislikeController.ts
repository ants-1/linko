import { NextFunction, Request, Response } from "express";
import dislikeModel from "../models/dislikeModel";
import postModel from "../models/postModel";
import likeModel from "../models/likeModel";

// @desc    Get dislike count for a post
// @route   GET /api/v1/dislikes/:postId
const getDislikeCount = async (
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

    const dislikeCount = await dislikeModel.countDocuments({ postId });
    return res.status(200).json({ postId, dislikeCount });
  } catch (err) {
    return next(err);
  }
};

// @desc    Toggle dislike status
// @route   POST /api/v1/dislikes
const toggleDislikes = async (
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

    const existingDislike = await dislikeModel.findOne({ userId, postId });

    if (existingDislike) {
      await dislikeModel.deleteOne({ _id: existingDislike._id });
      return res.status(200).json({ message: "Dislike removed." });
    } else {
      // Remove existing like before adding a dislike
      await likeModel.deleteOne({ userId, postId });
      await dislikeModel.create({ userId, postId });
      return res.status(201).json({ message: "Dislike added. Any existing like was removed." });
    }
  } catch (err) {
    return next(err);
  }
};
export default {
  getDislikeCount,
  toggleDislikes
};

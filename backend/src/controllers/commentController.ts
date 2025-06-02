import { NextFunction, Request, Response } from "express";
import commentModel from "../models/commentModel";
import postModel from "../models/postModel";
import userModel from "../models/userModel";

// @desc    Get all comments for a post
// @route   GET /api/v1/posts/:postId/comments
const getPostComments = async (
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

    const comments = await commentModel.find({ postId }).populate("userId", "username avatarUrl");
    return res.status(200).json({ comments });
  } catch (err) {
    return next(err);
  }
};

// @desc    Add comment to a post
// @route   POST /api/v1/posts/:postId/comments
const addComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;
    console.log(postId);

    if (!content) {
      return res.status(400).json({ error: "Comment content is required." });
    }

    const post = await postModel.findById(postId);
    console.log(post);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const newComment = await commentModel.create({ content, userId, postId });
    const populatedComment = await newComment.populate("userId", "username avatarUrl");

    return res.status(201).json({ message: "Comment added.", comment: populatedComment });
  } catch (err) {
    return next(err);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/v1/posts/:postId/comments/:commentId
const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const comment = await commentModel.findById(commentId);

    if (!comment || comment.postId.toString() !== postId) {
      return res.status(404).json({ error: "Comment not found for this post." });
    }

    // Only the comment owner or post author can delete
    const post = await postModel.findById(postId);
    
    if (!post) return res.status(404).json({ error: "Post not found." });

    if (comment.userId.toString() !== userId.toString() && post.author.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this comment." });
    }

    await comment.deleteOne();
    return res.status(200).json({ message: "Comment deleted." });
  } catch (err) {
    return next(err);
  }
};

export default {
  getPostComments,
  addComment,
  deleteComment,
}
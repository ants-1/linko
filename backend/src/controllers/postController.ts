import { NextFunction, Request, Response } from "express";
import postModel, { IPost } from "../models/postModel";
import userModel, { IUser } from "../models/userModel";
import { uploadImageCloudinary } from "../utils/cloudinary";
import multer from "multer";

const upload = multer({ dest: "./public/data/uploads/" });

// @desc    Get all posts
// @route   GET /api/v1/posts
const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await postModel.countDocuments();
    const posts = await postModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatarUrl")
      .exec();

    return res.status(200).json({
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get all posts of following users
// @route   GET /api/v1/posts/feeds
const getFeedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.body;

    const user: IUser | null = await userModel.findById(userId).exec();
    if (!user) {
      return res.status(404).json({ error: `User not found.` });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const followingIds = user.following || [];

    const totalPosts = await postModel.countDocuments({
      author: { $in: followingIds },
    });

    const posts = await postModel
      .find({ author: { $in: followingIds } })
      .skip(skip)
      .limit(limit)
      .populate("author", "username")
      .exec();

    return res.status(200).json({
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get single post
// @route   GET /api/v1/posts/:id
const getPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    post.viewCount = Number(post.viewCount ?? 0) + 1;
    await post.save();

    return res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
};

// @desc    Create new blog post
// @route   POST /api/v1/posts
const createPost = [
  upload.single("imgUrl"),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      let imageUrl: any = "";
      console.log('Request body:', req.body);

      if (req.file) {
        try {
          const result = await uploadImageCloudinary(req.file.path);
          imageUrl = result;
        } catch (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: `Error uploading image: ${err}` });
        }
      }

      const { userId } = req.body;
      const user: IUser | null = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const newPost = new postModel({
        title: req.body.title,
        imgUrl: req.body.imgUrl ?? imageUrl,
        content: req.body.content,
        country: req.body.country,
        visitDate: req.body.visitDate,
        author: userId,
      });

      if (!newPost) {
        return res.status(400).json({ error: "Unable to create new post." });
      }

      await newPost.save();

      return res.status(201).json(newPost);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Edit existing blog post
// @route   PUT /api/v1/posts/:id
const editPost = [
  upload.single("imgUrl"),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const user: IUser | null = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const existingPost = await postModel.findById(id);
      if (!existingPost) {
        return res.status(404).json({ error: "Post not found." });
      }

      let imageUrl: any = existingPost.imgUrl;
      if (req.file) {
        try {
          const result = await uploadImageCloudinary(req.file.path);
          imageUrl = result;
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: `Error uploading image.` });
        }
      }

      const updatedPostData = {
        title: req.body.title ?? existingPost.title,
        imgUrl: req.body.imgUrl ?? imageUrl,
        content: req.body.content ?? existingPost.content,
        country: req.body.country ?? existingPost.country,
        visitDate: req.body.visitDate ?? existingPost.visitDate,
      };

      const updatedPost = await postModel.findByIdAndUpdate(
        id,
        updatedPostData,
        {
          new: true,
        }
      );

      return res.status(200).json(updatedPost);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Delete existing blog post
// @route   DELETE /api/v1/posts/:id
const deletePost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?._id;

    const user: IUser | null = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const deletedPost = await postModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ error: "Unable to delete post or post not found." });
    }

    return res.status(200).json({ message: "Post successfully deleted.", id });
  } catch (err) {
    return next(err);
  }
};

export default {
  getAllPosts,
  getFeedPosts,
  getPost,
  createPost,
  editPost,
  deletePost,
};

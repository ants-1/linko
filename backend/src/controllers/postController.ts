import { NextFunction, Request, Response } from "express";
import postModel, { IPost } from "../models/postModel";
import userModel, { IUser } from "../models/userModel";
import likeModel, { ILike } from "../models/likeModel";
import dislikeModel, { IDislike } from "../models/dislikeModel";
import { uploadImageCloudinary } from "../utils/cloudinary";
import multer from "multer";
import commentModel, { IComment } from "../models/commentModel";

const upload = multer({ dest: "./public/data/uploads/posts/" });

// @desc    Get all posts
// @route   GET /api/v1/posts
const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { search } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? { title: { $regex: search as string, $options: "i" } }
      : {};

    const totalPosts = await postModel.countDocuments(searchFilter);
    const posts = await postModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatarUrl")
      .lean();

    const postIds = posts.map((post) => post._id);

    const [likeCounts, dislikeCounts, comments] = await Promise.all([
      likeModel.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      dislikeModel.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      commentModel
        .find({ postId: { $in: postIds } })
        .populate("userId", "username avatarUrl")
        .lean(),
    ]);

    const likeMap = new Map(
      likeCounts.map((item) => [item._id.toString(), item.count])
    );
    const dislikeMap = new Map(
      dislikeCounts.map((item) => [item._id.toString(), item.count])
    );

    const commentMap = new Map<string, IComment[]>();
    comments.forEach((comment) => {
      const postId = comment.postId.toString();
      if (!commentMap.has(postId)) {
        commentMap.set(postId, []);
      }
      commentMap.get(postId)!.push(comment);
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      likes: likeMap.get(post._id.toString()) || 0,
      dislikes: dislikeMap.get(post._id.toString()) || 0,
      comments: commentMap.get(post._id.toString()) || [],
    }));

    return res.status(200).json({
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      posts: formattedPosts,
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Get all posts of following users (feed)
// @route   GET /api/v1/posts/users/:id/feeds
const getFeedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;
    const { search } = req.query;

    const user: IUser | null = await userModel.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ error: `User not found.` });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const followingIds = user.following || [];

    if (!followingIds.length) {
      return res.status(200).json({
        totalPosts: 0,
        currentPage: page,
        totalPages: 0,
        posts: [],
      });
    }

    // Compose proper query
    const query: any = {
      author: { $in: followingIds },
    };

    if (search) {
      query.title = { $regex: search as string, $options: "i" };
    }

    const totalPosts = await postModel.countDocuments(query);

    const posts = await postModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate("author", "username avatarUrl")
      .lean();

    const postIds = posts.map((post) => post._id);

    const [likeCounts, dislikeCounts, comments] = await Promise.all([
      likeModel.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      dislikeModel.aggregate([
        { $match: { postId: { $in: postIds } } },
        { $group: { _id: "$postId", count: { $sum: 1 } } },
      ]),
      commentModel
        .find({ postId: { $in: postIds } })
        .populate("userId", "username avatarUrl")
        .lean(),
    ]);

    const likeMap = new Map(
      likeCounts.map((item) => [item._id.toString(), item.count])
    );
    const dislikeMap = new Map(
      dislikeCounts.map((item) => [item._id.toString(), item.count])
    );

    const commentMap = new Map<string, IComment[]>();
    comments.forEach((comment) => {
      const postId = comment.postId.toString();
      if (!commentMap.has(postId)) {
        commentMap.set(postId, []);
      }
      commentMap.get(postId)!.push(comment);
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      likes: likeMap.get(post._id.toString()) || 0,
      dislikes: dislikeMap.get(post._id.toString()) || 0,
      comments: commentMap.get(post._id.toString()) || [],
    }));

    return res.status(200).json({
      totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      posts: formattedPosts,
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

    const post = await postModel
      .findById(id)
      .populate("author", "username avatarUrl")
      .lean();

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    const [likeCount, dislikeCount, comments] = await Promise.all([
      likeModel.countDocuments({ postId: id }),
      dislikeModel.countDocuments({ postId: id }),
      commentModel
        .find({ postId: id })
        .populate("userId", "username avatarUrl")
        .lean(),
    ]);

    const formattedPost = {
      ...post,
      likes: likeCount,
      dislikes: dislikeCount,
      comments: comments,
    };

    return res.status(200).json(formattedPost);
  } catch (err) {
    return next(err);
  }
};

// @desc    Increase view count in post
// @route   GET /api/v1/posts/:id/views
const increaseViewCount = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;

    const updated = await postModel.findByIdAndUpdate(id, {
      $inc: { viewCount: 1 },
    });

    if (!updated) {
      return res.status(404).json({ error: "Post not found." });
    }

    return res.status(200).json({ message: "View count increased." });
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
  increaseViewCount,
  createPost,
  editPost,
  deletePost,
};

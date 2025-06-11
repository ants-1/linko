import { NextFunction, Request, Response } from "express";
import chatModel, { IChat } from "../models/chatModel";
import multer from "multer";
import { uploadImageCloudinary } from "../utils/cloudinary";
import userModel, { IUser } from "../models/userModel";
import messageModel from "../models/messageModel";

const upload = multer({ dest: "./public/data/uploads/chats/" });

// @desc    Get all chats
// @route   GET /api/v1/chats
const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const chats: IChat[] | null = await chatModel.find().exec();

    if (!chats) {
      return res.status(404).json({ message: "No chats found." });
    }

    return res.status(200).json(chats);
  } catch (err) {
    return next(err);
  }
};

// @desc    Get all user chats
// @routes  GET /api/v1/chats/users/:userId
const getUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { userId } = req.params;

    const user: IUser | null = await userModel.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const chats: IChat[] | null = await chatModel
      .find({
        $or: [{ users: userId }, { host: userId }],
      })
      .exec();

    if (!chats || chats.length === 0) {
      return res.status(404).json({ message: "No chats found for this user." });
    }

    return res.status(200).json(chats);
  } catch (err) {
    return next(err);
  }
};

// @desc    Get chat by ID
// @route   GET /api/v1/chats/:chatId
const getChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { chatId } = req.params;

    const chat: IChat | null = await chatModel
      .findById(chatId)
      .populate(["host", "users", "messages"])
      .exec();

    if (!chat) {
      return res.status(404).json({ error: "No chat found." });
    }

    return res.status(200).json(chat);
  } catch (err) {
    return next(err);
  }
};

// @desc    Create new chat
// @route   POST /api/v1/chats
const createChat = [
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

      const { name, imgUrl, hostId, countries } = req.body;
      const user: IUser | null = await userModel.findById(hostId);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const newChat = new chatModel({
        name,
        imgUrl: imgUrl ?? imageUrl,
        host: hostId,
        users: [hostId],
        messages: [],
        countries,
      });

      if (!newChat) {
        return res.status(400).json({ error: "Unable to create new chat" });
      }

      await newChat.save();
      res.status(201).json({ message: "Chat successfully created.", newChat });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Edit existing chat
// @route   PUT /api/v1/chats/:chatId
const editChat = [
  upload.single("imgUrl"),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { chatId } = req.params;
      const { name, imgUrl, hostId, countries } = req.body;

      const user: IUser | null = await userModel.findById(hostId);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      const existingChat = await chatModel.findById(chatId);

      if (!existingChat) {
        return res.status(404).json({ error: "Chat not found." });
      }

      if (hostId !== existingChat.host.toString()) {
        return res.status(403).json({ error: "unauthorised to delete chat." });
      }

      let prevImgUrl: any = existingChat.imgUrl;

      if (req.file) {
        try {
          const result = await uploadImageCloudinary(req.file.path);
          prevImgUrl = result;
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: `Error uploading image.` });
        }
      }

      const updatedChatData = {
        name: name ?? existingChat.name,
        imgUrl: imgUrl ?? prevImgUrl,
        countries: countries ?? existingChat.countries,
      };

      const updatedChat = await chatModel.findByIdAndUpdate(
        chatId,
        updatedChatData,
        { new: true }
      );

      return res.status(200).json(updatedChat);
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Delete existing chat
// @route   DELETE /api/v1/chats/:chatId
const deleteChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { chatId } = req.params;
    const { hostId } = req.body;

    const user: IUser | null = await userModel.findById(hostId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    if (!chat.host.equals(hostId)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this chat." });
    }

    await messageModel.deleteMany({ _id: { $in: chat.messages } });

    await chatModel.findByIdAndDelete(chatId);

    return res
      .status(200)
      .json({ message: "Chat and messages deleted.", chatId });
  } catch (err) {
    return next(err);
  }
};

// @desc    Join existing chat
// @route   PUT /api/v1/chats/:chatId/join
const joinChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const user: IUser | null = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    const chatUsers = chat.users;

    if (chatUsers?.includes(userId)) {
      return res.status(400).json({ error: "User is already in chat" });
    }

    chatUsers?.push(userId);

    if (!chatUsers?.includes(userId)) {
      return res.status(400).json({ error: "Error while joining chat." });
    }

    await chat.save();

    return res.status(200).json({
      message: "User successfully joined chat",
      chatId: chat._id,
      users: chat.users,
    });
  } catch (err) {
    console.error("Join chat error:", err);
    return next(err);
  }
};

// @desc    Leave existing chat
// @route   PUT /api/v1/chats/:chatId/leave
const leaveChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    if (chat.host.toString() === userId) {
      return res
        .status(403)
        .json({ error: "Host cannot leave their own chat." });
    }

    chat.users = chat.users?.filter((u) => u.toString() !== userId) || [];

    await chat.save();

    return res
      .status(200)
      .json({ message: "User successfully left the chat." });
  } catch (err) {
    return next(err);
  }
};

// @desc    Remove user from existing chat
// @route   PUT /api/v1/chats/:chatId/remove
const removeChatUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { chatId } = req.params;
    const { userId, hostId } = req.body;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }

    if (chat.host.toString() !== hostId) {
      return res
        .status(403)
        .json({ error: "Only host can remove users from the chat." });
    }

    if (!chat.users?.some((u) => u.toString() === userId)) {
      return res.status(400).json({ error: "User is not in this chat." });
    }

    chat.users = chat.users?.filter((u) => u.toString() !== userId) || [];

    await chat.save();

    return res
      .status(200)
      .json({ message: "User successfully removed from chat." });
  } catch (err) {
    return next(err);
  }
};

export default {
  getChats,
  getUserChats,
  getChat,
  createChat,
  editChat,
  deleteChat,
  joinChat,
  leaveChat,
  removeChatUser,
};

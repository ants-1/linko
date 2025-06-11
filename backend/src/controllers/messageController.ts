import { NextFunction, Request, Response } from "express";
import chatModel, { IChat } from "../models/chatModel";
import messageModel, { IMessage } from "../models/messageModel";
import multer from "multer";
import { uploadImageCloudinary } from "../utils/cloudinary";
import { Server } from "socket.io";

const upload = multer({ dest: "./public/data/uploads/messages/" });
let io: Server;

export const setSocketIO = (ioInstance: Server) => {
  io = ioInstance;
};

// @desc    Get all messages for chat
// @route   GET /api/v1/chats/:chatId/messages
const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findById(chatId).exec();

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const messages = await messageModel
      .find({ _id: { $in: chat.messages } })
      .populate("sender", "username avatarUrl")
      .exec();

    return res.status(200).json(messages);
  } catch (err) {
    return next(err);
  }
};

// @desc    Get message
// @route   GET /api/v1/chats/:chatId/messages/:messageId
const getMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await chatModel.findById(chatId).exec();

    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const message = await messageModel
      .findById(messageId)
      .populate("sender", "username avatarUrl")
      .exec();

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    return res.status(200).json(message);
  } catch (err) {
    return next(err);
  }
};

// @desc    Add message to chat
// @route   POST /api/v1/chats/:chatId/messages
const addMessage = [
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

      const { chatId } = req.params;
      const { sender, content } = req.body;

      const chat = await chatModel.findById(chatId);

      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      const newMessage = new messageModel({
        sender,
        content,
        imgUrl: req.body.imgUrl ?? imageUrl,
      });

      if (!newMessage) {
        return res.status(400).json({ error: "Unable to create new message" });
      }

      chat.messages.push(newMessage._id);

      await newMessage.save();
      await chat.save();

      const populatedMessage = await messageModel.findById(newMessage._id).populate("sender", "username avatarUrl").exec();

      io.to(chatId).emit("chat message", populatedMessage);

      return res.status(201).json({ message: "Message sent", newMessage });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Edit existing message
// @route   PUT /api/v1/chats/:chatId/messages/:messageId
const editMessage = [
  upload.single("imgUrl"),
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { chatId, messageId } = req.params;
      const { sender, content } = req.body;

      const chat = await chatModel.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found." });
      }

      const existingMessage = await messageModel.findById(messageId);
      if (!existingMessage) {
        return res.status(404).json({ error: "Message not found." });
      }

      if (existingMessage.sender.toString() !== sender) {
        return res
          .status(403)
          .json({ error: "User not authorised to edit this message." });
      }

      let updatedImgUrl: string | undefined = existingMessage.imgUrl;
      if (req.file) {
        try {
          const result = await uploadImageCloudinary(req.file.path);
          updatedImgUrl = result;
        } catch (err) {
          console.error("Image upload error:", err);
          return res.status(500).json({ error: "Failed to upload image." });
        }
      }

      existingMessage.content = content ?? existingMessage.content;
      existingMessage.imgUrl = req.body.imgUrl ?? updatedImgUrl;

      await existingMessage.save();

      return res.status(200).json({
        message: "Message successfully updated.",
        updatedMessage: existingMessage,
      });
    } catch (err) {
      return next(err);
    }
  },
];

// @desc    Delete existing message to chat
// @route   DELETE /api/v1/chats/:chatId/messages/:messageId
const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const deletedMessage = await messageModel.findByIdAndDelete(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    chat.messages = chat.messages.filter(
      (msgId) => msgId.toString() !== messageId
    );
    await chat.save();

    return res.status(200).json({ message: "Message deleted", messageId });
  } catch (err) {
    return next(err);
  }
};

export default {
  getMessages,
  getMessage,
  addMessage,
  editMessage,
  deleteMessage,
};

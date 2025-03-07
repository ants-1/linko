import ChatRoom from "../models/chatRoom.js";
import Message from "../models/message.js";

const getAllMessage = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const chatRoom = await ChatRoom.findById(chatRoomId).exec();

    if (!chatRoom) {
      return res
        .status(404)
        .json({ message: `Chat room with ID: ${chatRoomId} was not found` });
    }

    const messages = await Message.find({ chatRoom: chatRoomId });

    if (!messages) {
      return res
        .status(404)
        .json({ message: `No messages found in chat room: ${chatRoom.name}` });
    }

    return res.status(200).json({ messages });
  } catch (err) {
    return next(err);
  }
};

const getMessageById = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId).exec();

    if (!message) {
      return res.status(404).json({ message: "Message not found." });
    }

    return res.status(200).json({ message });
  } catch (err) {
    return next(err);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const chatRoom = await ChatRoom.findById(chatRoomId).exec();

    if (!chatRoom) {
      return res
        .status(404)
        .json({ error: `Chat room with ID: ${chatRoomId} not found.` });
    }

    const newMessage = new Message({
      message: req.body.content,
      sender: req.body.sender,
      chatRoom: chatRoomId,
    });

    await newMessage.save();

    return res.status(201).json({ newMessage });
  } catch (err) {
    return next(err);
  }
};

const editMessage = async (req, res, next) => {
  try {
    const { chatRoomId, messageId } = req.params;
    const chatRoom = await ChatRoom.findById(chatRoomId).exec();

    if (!chatRoom) {
      return res
        .status(404)
        .json({ error: `Chat room with ID: ${chatRoomId} was not found.` });
    }

    const updatedMessage = {
      message: req.body.message,
    };

    const message = await Message.findByIdAndUpdate(messageId, updatedMessage);

    if (!message) {
      return res.status(404).json({ error: "Error while updating message" });
    }

    return res.status(200).json({ updatedMessage });
  } catch (err) {
    return next(err);
  }
};

const deleteAllMessage = async (req, res, next) => {
  try {
    const { chatRoomId, userId } = req.params;
    const chatRoom = await ChatRoom.findById(chatRoomId).exec();

    if (!chatRoom) {
      return res
        .status(404)
        .json({ error: `Chat room with ID: ${chatRoomId} was not found.` });
    }

    if (chatRoom.host.toString() !== userId) {
      return res
        .status(403)
        .json({
          error: "Unauthorised: only the host can delete all messages.",
        });
    }

    await Message.deleteMany({ chatRoom: chatRoomId });
  } catch (err) {
    return next(err);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { chatRoomId, messageId } = req.params;
    const chatRoom = await ChatRoom.findById(chatRoomId).exec();

    if (!chatRoom) {
      return res
        .status(404)
        .json({ error: `Chat room with ID: ${chatRoomId} was not found.` });
    }

    const message = await Message.findById(messageId).exec();

    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    const deleteMessage = await Message.findById(messageId).exec();

    if (!deleteMessage) {
      return res.status(404).json({ error: "Error while deleting message." });
    }

    return res.status(200).json({ message: "Message successfully deleted." });
  } catch (err) {
    return next(err);
  }
};

export default {
  getAllMessage,
  getMessageById,
  createMessage,
  editMessage,
  deleteAllMessage,
  deleteMessage,
};

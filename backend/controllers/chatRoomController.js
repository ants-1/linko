import User from "../models/User.js";
import ChatRoom from "../models/chatRoom.js";

const getAllChatRooms = async (req, res, next) => {
  try {
    const chatRooms = await ChatRoom.find().exec();

    if (chatRooms.length === 0 || !chatRooms) {
      return res.status(404).json({ message: "No chat rooms found." });
    }

    return res.status(200).json({ chatRooms });
  } catch (err) {
    return next(err);
  }
};

const getChatRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const chatRoom = await ChatRoom.findById(id);

    if (!chatRoom) {
      return res
        .status(404)
        .json({ message: `Chat room with ID: ${id} not found.` });
    }

    return res.status(200).json({ chatRoom });
  } catch (err) {
    return next(err);
  }
};

const createChatRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const { name, description } = req.body;

    if (!user) {
      return res.status(404).json({
        message: `User with ID: ${id} not found. ID is required to create chat room.`,
      });
    }

    const existingChatRoom = await ChatRoom.findOne({ name });

    if (existingChatRoom) {
      return res
        .status(404)
        .json({ message: `Chat name: ${name}, already exist.` });
    }

    const createdChatRoom = new ChatRoom({
      name,
      description,
      host: id,
      users: [id],
    });

    if (!createdChatRoom) {
      return res
        .status(404)
        .json({ message: "Error while creating chat room." });
    }

    await createdChatRoom.save();

    return res.status(201).json({ createdChatRoom });
  } catch (err) {
    return next(err);
  }
};

const updateChatRoomData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const chatRoom = {
      name,
      description,
    };
    const updatedChatRoom = await ChatRoom.findByIdAndUpdate(id, chatRoom, {
      new: true,
    });

    if (!updatedChatRoom) {
      return res
        .status(404)
        .json({ mmessage: "Error while updating chat room data." });
    }

    return res.status(200).json({ updatedChatRoom });
  } catch (err) {
    return next(err);
  }
};

const joinChatRoom = async (req, res, next) => {
  try {
    const { userId, chatRoomId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID: ${userId} was not found.` });
    }

    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      return res
        .status(404)
        .json({ message: `Chat room with ID: ${chatRoomId} was not found.` });
    }

    const userExists = chatRoom.users.some((id) => id.equals(userId));

    if (userExists) {
      return res.status(400).json({
        message: `User with ID: ${userId} is already in the chat room.`,
      });
    }

    chatRoom.users.push(userId);
    await chatRoom.save();

    return res.status(200).json({
      message: `User with ID: ${userId} has joined chat room: ${chatRoom.name}`,
    });
  } catch (err) {
    return next(err);
  }
};

const leaveChatRoom = async (req, res, next) => {
  try {
    const { userId, chatRoomId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID: ${userId} was not found.` });
    }

    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      return res
        .status(404)
        .json({ message: `Chat room with ID: ${chatRoomId} was not found.` });
    }

    chatRoom.users = chatRoom.users.filter((id) => !id.equals(userId));

    const userExists = chatRoom.users.some((id) => id.equals(userId));

    if (userExists) {
      return res
        .status(400)
        .json({
          error: `Error occured when removing user from chat room: ${chatRoom.name}`,
        });
    }

    return res.status(200).json({
      message: `User with ID: ${userId} has left chat room: ${chatRoom.name}`,
    });
  } catch (err) {
    return next(err);
  }
};

const removeUser = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const { hostId, userId } = req.body;

    const host = await User.findById(hostId);
    const user = await User.findById(userId);

    if (!user || !host) {
      return res.status(404).json({ message: "User or host not found." });
    }

    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      return res
        .status(404)
        .json({ message: `Chat room with ID: ${chatRoomId} not found.` });
    }

    if (!chatRoom.host.equals(hostId)) {
      return res.status(403).json({
        message: `User with ID: ${userId} is not the host of the chat room.`,
      });
    }

    if (hostId == userId) {
      return res
        .status(400)
        .json({ message: `Host cannot remove themselves from chat room` });
    }

    const userExists = chatRoom.users.some((id) => id.equals(userId));

    if (!userExists) {
      return res
        .status(400)
        .json({ message: `User with ID: ${userId} is not in the chat room.` });
    }

    chatRoom.users = chatRoom.users.filter((id) => !id.equals(userId));
    await chatRoom.save();

    return res.status(200).json({
      message: `User: ${user.name} has been removed from the chat room: ${chatRoom.name}`,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteChatRoom = async (req, res, next) => {
  try {
    const { chatRoomId } = req.params;
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with ID: ${userId} not found.` });
    }

    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (chatRoom.host != userId) {
      return res.status(404).json({ message: `User is not host of chat room` });
    }

    const deletedChatRoom = await ChatRoom.findByIdAndDelete(chatRoomId);

    if (deletedChatRoom) {
      return res
        .status(404)
        .json({ message: "Error while deleting chat room" });
    }

    return res
      .status(200)
      .json({ message: `Chat room: ${chatRoom.name} successfully deleted` });
  } catch (err) {
    return next(err);
  }
};

export default {
  getAllChatRooms,
  getChatRoomById,
  createChatRoom,
  updateChatRoomData,
  deleteChatRoom,
  joinChatRoom,
  leaveChatRoom,
  removeUser,
};

import express from "express";
import chatRoomController from "../controllers/chatRoomController.js";

const router = express.Router();

router.get(
    "/chats",
    chatRoomController.getAllChatRooms
);
router.get(
    "/chats/:id",
    chatRoomController.getChatRoomById
);
router.post(
    "/chats",
    chatRoomController.createChatRoom
);
router.post(
  "/users/:userId/chats/:chatRoomId/join",
  chatRoomController.joinChatRoom
);
router.post(
  "/users/:userId/chats/:chatRoomId/leave",
  chatRoomController.leaveChatRoom
);
router.post(
    "/chats/:chatRoomId/remove",
    chatRoomController.removeUser
);
router.put(
    "/chats/:id",
    chatRoomController.updateChatRoomData
);
router.delete(
    "/chats/:chatRoomId", 
    chatRoomController.deleteChatRoom
);


export default router;
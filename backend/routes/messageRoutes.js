import express from "express";
import messageController from "../controllers/messageController.js";

const router = express.Router();

router.get(
    "/chats/:chatRoomId/messages",
    messageController.getAllMessage
);
router.get(
    "/messages/:messageId",
    messageController.getMessageById
);
router.post(
    "/chats/:chatRoomId/messages",
    messageController.createMessage
);
router.put(
    "/chats/:chatRoomId/messages",
    messageController.editMessage
);
router.delete(
    "/chats/:chatRoomId/host/:userId",
    messageController.deleteAllMessage
);
router.delete(
    "/chats/:chatRoomId/messages/:messageId",
    messageController.deleteMessage
);

export default router;
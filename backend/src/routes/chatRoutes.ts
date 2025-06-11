import express from "express";
import chatController from "../controllers/chatController";
import validateToken from "../utils/validateToken";

const router = express.Router();

router.get("/", chatController.getChats);
router.get("/:chatId", chatController.getChat);
router.get("/users/:userId", validateToken, chatController.getUserChats);
router.post("/", validateToken, chatController.createChat);
router.put("/:chatId", validateToken, chatController.editChat);
router.delete("/:chatId", validateToken, chatController.deleteChat);

router.put("/:chatId/join", validateToken, chatController.joinChat);
router.put("/:chatId/leave", validateToken, chatController.leaveChat);
router.put("/:chatId/remove", validateToken, chatController.removeChatUser);

export default router;

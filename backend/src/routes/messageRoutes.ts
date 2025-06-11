import express from "express";
import messageController from "../controllers/messageController";
import validateToken from "../utils/validateToken";

const router = express.Router();

router.get("/:chatId/messages", messageController.getMessages);
router.get("/:chatId/messages/:chatId", messageController.getMessage);
router.post("/:chatId/messages", validateToken, messageController.addMessage);
router.put("/:chatId/messages/:messageId", validateToken, messageController.editMessage);
router.delete("/chatId/messages/:messageId", validateToken, messageController.deleteMessage);

export default router;
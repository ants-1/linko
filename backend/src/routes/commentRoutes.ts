import express from "express";
import commentController from "../controllers/commentController";
import validateToken from "../utils/validateToken";

const router = express.Router();

router.get("/:postId/comments", commentController.getPostComments);
router.post("/:postId/comments", validateToken, commentController.addComment);
router.delete("/:postId/comments/:commentId", validateToken, commentController.deleteComment);

export default router;

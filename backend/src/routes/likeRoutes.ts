import express from "express";
import likeController from "../controllers/likeController";

const router = express.Router();

router.get("/:postId", likeController.getLikeCount);
router.post("/", likeController.toggleLikes);

export default router;

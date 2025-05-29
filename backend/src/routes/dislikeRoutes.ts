import express from "express";
import dislikeController from "../controllers/dislikeController";

const router = express.Router();

router.get("/:postId", dislikeController.getDislikeCount);
router.post("/", dislikeController.toggleDislikes);

export default router;

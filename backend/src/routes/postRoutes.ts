import express from "express";
import postController from "../controllers/postController";
import validateToken from "../utils/validateToken";
import commentRoutes from "../routes/commentRoutes";

const router = express.Router();

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPost);
router.get("/feeds", validateToken, postController.getFeedPosts);
router.post("/", validateToken, ...postController.createPost);
router.put("/:id", validateToken, ...postController.editPost);
router.delete("/:id", validateToken, postController.deletePost);

router.use("/", commentRoutes);

export default router;
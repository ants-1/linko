import express from "express";
import followController from "../controllers/followController";

const router = express.Router();

router.put("/follows/toggle", followController.toggleFollow);
router.get("/users/:userId/followers", followController.getFollowers);
router.get("/users/:userId/followings", followController.getFollowing);

export default router;

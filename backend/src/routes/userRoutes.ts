import express from "express";
import userController from "../controllers/userController";
import validateToken from "../utils/validateToken";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:userId", userController.getUser);
router.put("/:userId", validateToken, userController.updateUserData);
router.put("/:userId/password", validateToken, userController.updateUserPassword);

export default router;
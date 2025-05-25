import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

router.post("/sign-up", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

export default router;
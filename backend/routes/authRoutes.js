import express from "express";
import authController from "../controllers/authController.js";
import validateToken from "../utils/validateToken.js";

const router = express.Router();

router.post("/auth/sign-up", authController.signUp);
router.post("/auth/login", authController.login);
router.get("/auth/logout", authController.logout);
router.get("/auth/token", validateToken);

export default router;

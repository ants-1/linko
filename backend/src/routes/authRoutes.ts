import express from "express";
import authController from "../controllers/authController";
import passport from "passport";

const router = express.Router();

router.post("/sign-up", authController.signUp);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", authController.googleCallback);

export default router;

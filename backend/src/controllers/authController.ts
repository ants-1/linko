import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { IUser } from "../models/userModel";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken";

dotenv.config();

// @desc    Register new user
// @route   POST /api/v1/auth/sign-up
const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate("signup", (err: Error, user: IUser) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({
        message: "Sign up failed.",
      });
    }

    req.login(user, async (loginErr) => {
      if (loginErr) {
        return res.status(400).json({
          error: "Login failed.",
        });
      }

      try {
        const token = generateToken(user);
        return res.status(201).json({
          success: true,
          token,
          user,
        });
      } catch (tokenErr) {
        return next(tokenErr);
      }
    });
  })(req, res, next);
};

// @desc    Login as existing user
// @route   POST /api/v1/auth/login
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate("login", (err: Error | null, user: IUser | false) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials.",
      });
    }

    req.login(user, async (loginErr) => {
      if (loginErr) {
        return res.status(400).json({
          error: "Login failed.",
        });
      }

      try {
        const token = generateToken(user);
        return res.status(200).json({
          success: true,
          token,
          user
        });
      } catch (tokenErr) {
        return next(tokenErr);
      }
    });
  })(req, res, next);
};

// @desc    Login as guest user
// @route   POST /api/v1/auth/guest-login
const guestLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const GUEST_EMAIL = process.env.GUEST_EMAIL;
  const GUEST_PASSWORD = process.env.GUEST_PASSWORD;

  res.status(200).json({
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  });
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: "Logout successful.",
      });
    });
  } catch (err) {
    return next(err);
  }
};

// @desc    Login with Google account
// @route   POST /api/v1/auth/google
const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  passport.authenticate(
    "google",
    { session: false },
    async (err: Error, user: IUser) => {
      if (err || !user) {
        return res.status(400).json({ error: "Google authentication failed" });
      }

      try {
        const token = generateToken(user);
        console.log(user)
        const redirectUrl = new URL(`${process.env.CLIENT_URL}/google/callback`);
        redirectUrl.searchParams.append("token", token);
        redirectUrl.searchParams.append("username", user.username);
        redirectUrl.searchParams.append("email", user.email);
        redirectUrl.searchParams.append("avatarUrl", user.avatarUrl || "");

        res.redirect(redirectUrl.toString());
      } catch (err) {
        return next(err);
      }
    }
  )(req, res, next);
};

export default {
  signUp,
  login,
  guestLogin,
  logout,
  googleCallback,
};

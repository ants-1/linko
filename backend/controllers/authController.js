import passport from "passport";
import generateToken from "../utils/generateToken.js";

const signUp = async (req, res, next) => {
  passport.authenticate("signup", (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).json({
        error: "Sign up failed. User already exists or invalid data.",
      });
    }

    req.login(user, { session: false }, async (loginErr) => {
      if (loginErr) {
        return res.status(400).json({ error: "Error during login process." });
      }

      try {
        const token = generateToken(user);
        return res.status(201).json({ success: true, token, user });
      } catch (generateTokenErr) {
        return next(generateTokenErr);
      }
    });
  })(req, res, next);
};

const login = async (req, res, next) => {
  passport.authenticate("login", (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    req.login(user, { session: false }, async (loginErr) => {
      if (loginErr) {
        return res.status(400).json({ error: "Error during login process. " });
      }

      try {
        const token = generateToken(user);
        return res.status(200).json({ success: true, token });
      } catch (generateTokenErr) {
        return next(generateTokenErr);
      }
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({ success: true, message: "Logout successful." });
    });
  } catch (err) {
    return next(err);
  }
};

export default {
  signUp,
  login,
  logout,
};

import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../../models/User.js";

const initializeLogin = () => {
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
      },
      async (username, password, done) => {
        try {
          const user = await User.findOne({ username });

          if (!user) {
            return done(null, false, { message: "Invalid username" });
          }

          const matchedPassword = await bcrypt.compare(password, user.password);

          if (!matchedPassword) {
            return done(null, false, { message: "Invalid password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default initializeLogin;
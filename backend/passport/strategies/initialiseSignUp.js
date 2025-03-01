import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../../models/User.js";

const initializeSignUp = () => {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          const { email, name } = req.body;
          const existingUser = await User.findOne({ username });

          if (existingUser) {
            return done(null, false, { message: "Username already exists" });
          }
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await User.create({
            username,
            name,
            email,
            password: hashedPassword,
          });

          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};

export default initializeSignUp;

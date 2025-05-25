import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../../models/userModel";

const initaliseGoogleLogin = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile: any, done) => {
        try {
          let user = await userModel.findOne({
            $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          });

          if (!user) {
            user = new userModel({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              avatarUrl: profile.photos[0].value,
            });

            await user.save();
          }

          return done(null, user);
        } catch (err) {
          console.error("Google Authentication Error:", err);
          return done(err, false);
        }
      }
    )
  );
};


export default initaliseGoogleLogin;
import passport from 'passport';
import { Request } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import userModel, { IUser } from '../../models/userModel';

const initialiseSignUp = (): void => {
  passport.use(
    'signup',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req: Request, email: string, password: string, done) => {
        try {
          const { username } = req.body;
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser: IUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
          });

          return done(null, newUser);
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  )
}

export default initialiseSignUp;
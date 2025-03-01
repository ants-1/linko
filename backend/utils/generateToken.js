import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
  const TOKEN_EXPIRE_TIME = process.env.TOKEN_EXPIRE_TIME;

  const { _id, email } = user;

  return jwt.sign(
    {
      user: {
        _id,
        email,
      },
      expiresIn: TOKEN_EXPIRE_TIME,
    },
    TOKEN_SECRET_KEY
  );
};

export default generateToken;
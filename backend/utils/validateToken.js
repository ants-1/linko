import jwt from "jsonwebtoken";

const TOKEN_ERROR_MESSAGE = "Invalid token";

const validateToken = (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];

    if (!bearerHeader) {
      return res.status(401).json({ error: { message: TOKEN_ERROR_MESSAGE } });
    }

    const bearer = bearerHeader.split(" ");

    if (bearer.length !== 2 || bearer[0] !== "Bearer") {
      return res.status(401).json({ error: { message: TOKEN_ERROR_MESSAGE } });
    }

    const token = bearer[1];

    if (!token) {
      return res.status(401).json({ error: { message: TOKEN_ERROR_MESSAGE } });
    }

    const SECRET = process.env.TOKEN_SECRET_KEY;
    if (!SECRET) {
      console.error("Missing TOKEN_SECRET_KEY in environment variables.");
      return res
        .status(500)
        .json({ error: { message: "Internal server error" } });
    }

    const decoded = jwt.verify(token, SECRET);

    return res.status(200).json({ user: decoded });
  } catch (err) {
    return res.status(401).json({ error: { message: TOKEN_ERROR_MESSAGE } });
  }
};

export default validateToken;

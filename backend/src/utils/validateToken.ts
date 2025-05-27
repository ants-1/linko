import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: any; 
}

const TOKEN_ERROR_MESSAGE = "Invalid token";

const validateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
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

    const SECRET = process.env.TOKEN_SECRET_KEY as string;
    const decoded = jwt.verify(token, SECRET);

    if (!decoded || typeof decoded !== "object") {
      return res.status(401).json({ error: { message: TOKEN_ERROR_MESSAGE } });
    }

    req.user = (decoded as any).user;

    next();
  } catch (error) {
    return res.status(401).json({ error: { message: TOKEN_ERROR_MESSAGE } });
  }
};

export default validateToken;

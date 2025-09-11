import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
  role: "ADMIN" | "MEMBER";
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const secret = process.env.JWT_SECRET || "supersecret";
    const payload = jwt.verify(token, secret) as JwtPayload;

    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export const authorize = (roles: Array<"ADMIN" | "MEMBER">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};

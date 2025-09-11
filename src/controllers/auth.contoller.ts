import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET || "supersecret";
export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        msg: "Both email and password are required",
      });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(401).json({
        msg: "Invalid email or password",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        msg: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, secret, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err); // log the full error to backend console
    return res.status(500).json({
      msg: "Error while logging in",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

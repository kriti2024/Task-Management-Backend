import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { hashPassword } from "../controllers/user.controller.js";

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, image } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        msg: "All fields are required",
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "MEMBER",
        image: image || "",
      },
    });
    return res.status(201).json({
      msg: "User created successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Failed to create user",
    });
  }
};

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const hashPassword = async (plainPassword: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const hashed = await hashPassword(password);
    //password encrypt garya hashPassword use garera
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        role: role || "Member",
      },
    }); // Prisma ORM use garera naya data create garya user table ma

    return res.status(201).json({
      msg: "User created",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Error in creating user",
    });
  }
};


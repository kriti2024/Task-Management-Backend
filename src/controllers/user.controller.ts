import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const hashPassword = async (plainPassword: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const hashed = await hashPassword(password);
    //password encrypt garya hashPassword use garera

    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashed,
        role: role || "Member",
        image,
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

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const search = String(req.query.search || "");
    const from = req.query.from ? new Date(String(req.query.from)) : undefined;
    const to = req.query.to ? new Date(String(req.query.to)) : undefined;

    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    const totalUsers = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        image: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      msg: "Users fetched successfully",
      users,
      currentPage: page,
      perPage,
      total: totalUsers,
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error while fetching users",
      error: err,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // user id get garni from req params (/user/:id)

    const { username, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    if (email && email !== existingUser.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });
      if (emailTaken) {
        return res.status(400).json({
          msg: "Email already existed",
        });
      }
    }

    let image = existingUser.image;

    if (req.file) {
      if (existingUser.image) {
        const oldPath = path.join(process.cwd(), existingUser.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath); // delete old file
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    const user = await prisma.user.update({
      where: { id: Number(id) }, //convert id from string-->number
      data: {
        username: username ?? existingUser.username,
        email: email ?? existingUser.email,
        password: password ? await hashPassword(password) : undefined,
        //if password xa vani --> hash garera update garni otherwise password xain vani leave unchanged
        role: role ?? existingUser.role,
        image,
      },
    });
    return res.status(200).json({
      msg: "User updated successfully",
      user,
    }); //json res dinxa updated user ko
  } catch (err) {
    return res.status(500).json({
      msg: "Error in updating user",
      error: err,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    //id parameter extract garya from the request URL

    const { id } = req.params;
    //delete user where id matches
    const existingUser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    await prisma.user.delete({
      where: { id: Number(id) }, //string id-->is Number
    });
    return res.status(200).json({
      msg: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in deleting user",
      error: err,
    });
  }
};

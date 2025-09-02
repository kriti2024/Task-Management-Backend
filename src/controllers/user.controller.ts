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

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    //page number chai passed in query params (?page=2) ani kei xaina vani defaults to page=1
    const perPage = Number(req.query.perPage) || 10;
    //how many users per page (eg?perPage=5) ani kei xaina vani defaults to page = 1 and perPage=10
    const search = String(req.query.search) || "";
    //user le search keyworkd pathauni ho username or email serach garni
    //(?search=kriti) yoh related seach garxa username or email
    //kei pathako xaina vani empty string

    const users = await prisma.user.findMany({
      where: {
        //filter garna use garya
        OR: [
          //check if username OR email contains the search term.
          //ani mode "insensitive" ley case-insensitive banauxa
          { username: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
      skip: (page - 1) * perPage, //kun page ko data chai suru garne vanera calculate garxa eg: page=2, perPage=10 skips 10 users ani 11th user dekhauni
      take: perPage, //kati oota user fetch garni
      select: { id: true, username: true, email: true, role: true },
      //kun kun column return garni vanera list
    });

    const totalCount = await prisma.user.count({
      where: {
        OR: [
          //yesh ma total users kati oota xa db ma joh chai tiyo search filter ma parxa
          { username: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      },
    });
    return res.status(200).json({
      msg: "User fetched successfully",
      users, //actual userlist
      totalCount, //total no. of user found
      currentPage: page, //kun ma chau currently
      perPage, //per page kati users
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
    const { id } = req.params; // user id get garni from req params (/users/:id)

    const { username, email, password, role } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) }, //convert id from string-->number
      data: {
        username,
        email,
        password: password ? await hashPassword(password) : undefined,
        //if password xa vani --> hash garera update garni otherwise password xain vani leave unchanged
        role,
      },
    });
    return res.status(201).json({
      msg: "User updated successfully",
      user,
    }); //json res dinxa updated user ko
  } catch (err) {
    return res.status(500).json({
      msg: "Error in adding user",
      error: err,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    // id parameter extract garya from the request URL
    const { id } = req.params;
    //delete user where id matches
    const user = await prisma.user.delete({
      where: { id: Number(id) }, //string id-->is Number
    });
    return res.status(201).json({
      msg: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      msg: "Error in deleting user",
      error: err,
    });
  }
};

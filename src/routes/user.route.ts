import { Router } from "express";
import {
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/", createUser);

userRouter.get("/", getAllUser);

userRouter.put("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

export default userRouter;

import { Router } from "express";
import {
  createUser,
  getAllUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
const userRouter = Router();

userRouter.post(
  "/",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  createUser
);

userRouter.get("/", authenticate, authorize(["ADMIN"]), getAllUser);

userRouter.put(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  upload.single("image"),
  updateUser
);

userRouter.delete("/:id", authenticate, authorize(["ADMIN"]), deleteUser);

export default userRouter;

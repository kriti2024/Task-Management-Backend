import { Router } from "express";
import userRouter from "./user.route.js";
import authRouter from "./auth.route.js";
import taskRouter from "./task.route.js";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/task", taskRouter);
export default router;

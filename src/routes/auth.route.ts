import { Router } from "express";
import { loginHandler } from "../controllers/auth.contoller.js";
import { registerUser } from "../controllers/auth.register.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/register", authenticate, authorize(["ADMIN"]), registerUser);

export default authRouter;

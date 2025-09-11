import { Router } from "express";
import {
  getTask,
  createTask,
  updateTask,
  deleteTask,
  statusUpdate,
  assignToUpdate,
} from "../controllers/task.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const taskRouter = Router();

taskRouter.get("/", authenticate, getTask);

taskRouter.post("/", authenticate, createTask);

taskRouter.put(
  "/:id",
  authenticate,
  authorize(["ADMIN", "MEMBER"]),
  updateTask
);

taskRouter.delete("/:id", authenticate, authorize(["ADMIN"]), deleteTask);

taskRouter.put(
  "/status/:id",
  authenticate,
  authorize(["ADMIN", "MEMBER"]),
  statusUpdate
);

taskRouter.put(
  "/assign/:id",
  authenticate,
  authorize(["ADMIN"]),
  assignToUpdate
);

export default taskRouter;

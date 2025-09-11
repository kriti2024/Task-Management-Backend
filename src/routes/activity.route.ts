import { Router } from "express";
import {
  getActivities,
  deleteActivity,
} from "../controllers/activity.controller.js";

const router = Router();

router.get("/", getActivities);

router.delete("/:id", deleteActivity);

export default router;

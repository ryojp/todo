import { Router } from "express";

import {
  allTasks,
  createTask,
  deleteTask,
  getTask,
  updateTask,
} from "../controllers/task";
import { verifyToken } from "../middleware/verifyToken";

export const router = Router();

router.use(verifyToken);

router.route("/").get(allTasks).post(createTask);

router.route("/:taskId").get(getTask).put(updateTask).delete(deleteTask);

export default router;

import { Router } from "express";

import {
  all_tasks,
  create_task,
  get_task,
  update_task,
  delete_task,
} from "../controllers/taskController";
import { verifyToken } from "../middleware/verifyToken";

export const router = Router();

router.use(verifyToken);

router.route("/").get(all_tasks).post(create_task);

router.route("/:taskId").get(get_task).put(update_task).delete(delete_task);

export default router;

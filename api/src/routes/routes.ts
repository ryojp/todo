import { Express } from "express";
import {
  all_tasks,
  create_task,
  get_task,
  update_task,
  delete_task,
} from "../controllers/taskController";
import {
  authenticate,
  createUser,
  verifyToken,
} from "../controllers/userController";

const routes = (app: Express) => {
  app.post("/signup", createUser);
  app.post("/login", authenticate);

  app.use(verifyToken);

  app.route("/tasks").get(all_tasks).post(create_task);

  app
    .route("/tasks/:taskId")
    .get(get_task)
    .put(update_task)
    .delete(delete_task);
};

export default routes;

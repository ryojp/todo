module.exports = (app) => {
  const taskList = require("../controllers/taskController");

  app.route("/tasks").get(taskList.all_tasks).post(taskList.create_task);

  app
    .route("/tasks/:taskId")
    .get(taskList.get_task)
    .put(taskList.update_task)
    .delete(taskList.delete_task);
};

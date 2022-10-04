const mongoose = require("mongoose");
const Task = mongoose.model("Tasks");

// Fetch all the tasks
exports.all_tasks = (req, res) => {
  Task.find({}, (err, task) => {
    if (err) res.send(err);
    res.json(task);
  });
};

// Create a new task
exports.create_task = (req, res) => {
  const body = req.body;
  body.name = body.name.trim(); // just in case

  // verify non-emptiness
  if (body.name === "") {
    res.json({ error: "Task name should not be empty!" });
    return;
  }

  const new_task = new Task(body);
  new_task.save((err, task) => {
    if (err) res.send(err);
    res.json(task);
  });
};

// Get the task with the given ID
exports.get_task = (req, res) => {
  Task.findById(req.params.taskId, (err, task) => {
    if (err) res.send(err);
    res.json(task);
  });
};

// Update the task with the given ID
exports.update_task = (req, res) => {
  const body = req.body;
  body.name = body.name.trim(); // just in case

  // verify non-emptiness
  if (body.name === "") {
    res.json({ error: "Task name should not be empty!" });
    return;
  }

  Task.findOneAndUpdate(
    { _id: req.params.taskId },
    body,
    { new: true },
    (err, task) => {
      if (err) res.send(err);
      res.json(task);
    }
  );
};

// Delete the task with the given ID
exports.delete_task = (req, res) => {
  Task.remove({ _id: req.params.taskId }, (err, task) => {
    if (err) res.send(err);
    res.json({ message: "Successfully deleted the task" });
  });
};

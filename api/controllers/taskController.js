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
  const new_task = new Task(req.body);
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
  Task.findOneAndUpdate(
    { _id: req.params.taskId },
    req.body,
    { new: true },
    (err, task) => {
      if (err) res.send(err);
      res.json(task);
    }
  );
};

exports.delete_task = (req, res) => {
  Task.remove({ _id: req.params.taskId }, (err, task) => {
    if (err) res.send(err);
    res.json({ message: "Successfully deleted the task" });
  });
};

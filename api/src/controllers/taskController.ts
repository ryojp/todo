import Task, { ITaskDoc } from "../models/taskModel";
import { Request, Response } from "express";
import { CallbackError } from "mongoose";

// Fetch all the tasks
export const all_tasks = (_: Request, res: Response) => {
  Task.find({}, (err: CallbackError, doc: ITaskDoc) => {
    if (err) res.send(err);
    res.json(doc);
  });
};

// Create a new task
export const create_task = (req: Request, res: Response) => {
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
export const get_task = (req: Request, res: Response) => {
  Task.findById(req.params.taskId, (err: CallbackError, doc: ITaskDoc) => {
    if (err) res.send(err);
    res.json(doc);
  });
};

// Update the task with the given ID
export const update_task = (req: Request, res: Response) => {
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
export const delete_task = (req: Request, res: Response) => {
  Task.deleteOne({ _id: req.params.taskId }, (err) => {
    if (err) res.send(err);
    res.json({ message: "Successfully deleted the task" });
  });
};

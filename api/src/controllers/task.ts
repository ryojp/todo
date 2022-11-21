import Task, { ITaskDoc } from "../models/task";
import { NextFunction, Request, Response } from "express";
import { CallbackError } from "mongoose";
import { HttpError } from "../middleware/error";

// Fetch all the tasks
export const allTasks = (_: Request, res: Response, next: NextFunction) => {
  Task.find({}, (err: CallbackError, doc: ITaskDoc) => {
    if (err) return next(err);
    res.json(doc);
  });
};

// Create a new task
export const createTask = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  body.name = body.name.trim(); // just in case

  // verify non-emptiness
  if (body.name === "") {
    return next(new HttpError("Task name should not be empty!", 400));
  }

  const new_task = new Task(body);
  new_task.save((err, task) => {
    if (err) return next(err);
    res.json(task);
  });
};

// Get the task with the given ID
export const getTask = (req: Request, res: Response, next: NextFunction) => {
  Task.findById(req.params.taskId, (err: CallbackError, doc: ITaskDoc) => {
    if (err) return next(err);
    res.json(doc);
  });
};

// Update the task with the given ID
export const updateTask = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  body.name = body.name.trim(); // just in case

  // verify non-emptiness
  if (body.name === "") {
    return next(new HttpError("Task name should not be empty!", 40));
  }

  Task.findOneAndUpdate(
    { _id: req.params.taskId },
    body,
    { new: true },
    (err, task) => {
      if (err) next(err);
      res.json(task);
    }
  );
};

// Delete the task with the given ID
export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  Task.deleteOne({ _id: req.params.taskId }, (err) => {
    if (err) next(err);
    res.json({ message: "Successfully deleted the task" });
  });
};

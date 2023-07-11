import Task, { ITaskDoc } from "../models/task";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../middleware/error";
import User from "../models/auth";

// Fetch all the tasks for a given user
export const allTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return next(new HttpError("userId not found from Request", 400));
    }
    const user = await User.findById(req.userId).populate<{
      tasks: Array<ITaskDoc>;
    }>("tasks");
    if (!user) {
      return next(new HttpError("User not found", 400));
    }
    res.json(user.tasks);
  } catch (err) {
    return next(err);
  }
};

// Create a new task
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  try {
    if (!req.userId) {
      return next(new HttpError("userId not found from Request", 400));
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new HttpError("User not found", 400));
    }
    const task = new Task({ ...body, creatorId: user._id });
    await task.save();
    user.tasks.push(task._id);
    await user.save();
    res.json(task);
  } catch (err) {
    return next(err);
  }
};

// Get the task with the given ID
export const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return next(new HttpError("userId not found from Request", 400));
    }
    const doc = await Task.findById(req.params.taskId);
    if (!doc) {
      return next(new HttpError("Task not found", 400));
    }
    if (doc.creatorId.toString() !== req.userId) {
      return next(new HttpError("Forbidden", 403));
    }
    return res.json(doc);
  } catch (err) {
    return next(err);
  }
};

// Update the task with the given ID
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  try {
    if (!req.userId) {
      return next(new HttpError("userId not found from Request", 400));
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new HttpError("User not found", 400));
    }
    const doc = await Task.findById(req.params.taskId);
    if (!doc) {
      return next(new HttpError("Task not found", 400));
    }
    if (doc.creatorId.toString() !== req.userId) {
      return next(new HttpError("Forbidden", 403));
    }
    doc.set(body);
    doc.save();
    return res.json(doc);
  } catch (err) {
    return next(err);
  }
};

// Delete the task with the given ID
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return next(new HttpError("userId not found from Request", 400));
    }
    let doc = await Task.findById(req.params.taskId);
    if (!doc) {
      return next(new HttpError("Task not found", 400));
    }
    if (doc.creatorId.toString() !== req.userId) {
      return next(new HttpError("Forbidden", 403));
    }
    await Task.deleteOne({_id: req.params.taskId});
    return res.json({ message: "Successfully deleted the task" });
  } catch (err) {
    return next(err);
  }
};

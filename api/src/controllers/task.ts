import Task, { ITaskDoc } from "../models/task";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../middleware/error";
import User from "../models/auth";

// Fetch all the tasks for a given user
export const allTasks = async (
  req: Request & { username?: string },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.username) {
      return next(new HttpError("Username not found from Request", 400));
    }
    const user = await User.findOne({ username: req.username }).populate<{
      tasks: ITaskDoc;
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
  req: Request & { username?: string },
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  try {
    if (!req.username) {
      return next(new HttpError("Username not found from Request", 400));
    }
    const user = await User.findByUsername(req.username);
    if (!user) {
      return next(new HttpError("User not found", 400));
    }
    const task = new Task({ ...body, creator: user.username });
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
  req: Request & { username?: string },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.username) {
      return next(new HttpError("Username not found from Request", 400));
    }
    const doc = await Task.findById(req.params.taskId);
    if (!doc) {
      return next(new HttpError("Task not found", 400));
    }
    if (doc.creator !== req.username) {
      return next(new HttpError("Forbidden", 403));
    }
    return res.json(doc);
  } catch (err) {
    return next(err);
  }
};

// Update the task with the given ID
export const updateTask = async (
  req: Request & { username?: string },
  res: Response,
  next: NextFunction
) => {
  const body = req.body;

  try {
    if (!req.username) {
      return next(new HttpError("Username not found from Request", 400));
    }
    const user = await User.findByUsername(req.username);
    if (!user) {
      return next(new HttpError("User not found", 400));
    }
    const doc = await Task.findById(req.params.taskId);
    if (!doc) {
      return next(new HttpError("Task not found", 400));
    }
    if (doc.creator !== req.username) {
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
  req: Request & { username?: string },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.username) {
      return next(new HttpError("Username not found from Request", 400));
    }
    let doc = await Task.findById(req.params.taskId);
    if (!doc) {
      return next(new HttpError("Task not found", 400));
    }
    if (doc.creator !== req.username) {
      return next(new HttpError("Forbidden", 403));
    }
    await doc.delete();
    return res.json({ message: "Successfully deleted the task" });
  } catch (err) {
    return next(err);
  }
};

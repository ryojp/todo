import { Schema, model, Document } from "mongoose";

interface ITask {
  name: string;
  details?: string;
  due?: Date;
  creator: string;
}

export interface ITaskDoc extends Document, ITask {}

export const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: "Enter the name of the task",
    },
    details: String,
    due: Date,
    creator: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Task = model<ITaskDoc>("Task", TaskSchema);

export default Task;

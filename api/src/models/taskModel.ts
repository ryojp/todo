import { Schema, model, Document } from "mongoose";

interface ITask {
  name: string
  Created_date: string
}

export interface ITaskDoc extends Document, ITask {}

const TaskSchema = new Schema({
  name: {
    type: String,
    required: "Enter the name of the task",
  },
  Created_date: {
    type: Date,
    defualt: Date.now,
  },
});

const Task = model<ITaskDoc>("Tasks", TaskSchema);

export default Task;

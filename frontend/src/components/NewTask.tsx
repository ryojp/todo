import React from "react";
import TaskForm from "./TaskForm";

import { TaskType } from "./taskTypes";

type PropsType = {
  onAddTask: (task: TaskType) => void;
};

const NewTask: React.FC<PropsType> = (props) => {
  return (
    <div>
      <TaskForm
        onSubmit={(enteredTaskData: TaskType) => {
          props.onAddTask(enteredTaskData);
        }}
      />
    </div>
  );
};

export default NewTask;

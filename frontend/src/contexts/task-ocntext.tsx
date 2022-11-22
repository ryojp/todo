import { createContext, ReactNode, useState } from "react";
import { TaskType } from "../components/taskTypes";

const TaskContext = createContext({
  tasks: Array<TaskType>(),
  setTasks: (_: Array<TaskType>) => {},
  addTask: (_: TaskType) => {},
  updateTask: (_: TaskType) => {},
  deleteTask: (_: TaskType) => {},
});

type Props = {
  children?: ReactNode;
};

export const TaskContextProvider: React.FC<Props> = ({ children }) => {
  const [tasks, setTasks] = useState<Array<TaskType>>([]);

  const addTask = (task: TaskType) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (task: TaskType) => {
    setTasks((prev) =>
      prev.map((elem: TaskType) => {
        if (elem._id !== task._id) return elem;
        else return task;
      })
    );
  };

  const deleteTask = (task: TaskType) => {
    setTasks((prev) => prev.filter((elem: TaskType) => elem._id !== task._id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, addTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;

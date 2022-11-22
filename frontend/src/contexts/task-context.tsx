import { createContext, ReactNode, useState } from "react";
import { Task } from "../types/task";

const TaskContext = createContext({
  tasks: Array<Task>(),
  setTasks: (_: Array<Task>) => {},
  addTask: (_: Task) => {},
  updateTask: (_: Task) => {},
  deleteTask: (_: Task) => {},
});

type Props = {
  children?: ReactNode;
};

export const TaskContextProvider: React.FC<Props> = ({ children }) => {
  const [tasks, setTasks] = useState<Array<Task>>([]);

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (task: Task) => {
    setTasks((prev) =>
      prev.map((elem: Task) => {
        if (elem._id !== task._id) return elem;
        else return task;
      })
    );
  };

  const deleteTask = (task: Task) => {
    setTasks((prev) => prev.filter((elem: Task) => elem._id !== task._id));
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

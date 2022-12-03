import { Fragment } from "react";
import NewTask from "./NewTask";
import TaskList from "./TaskList";

const TaskMain = () => {
  return (
    <Fragment>
      <NewTask />
      <TaskList />
    </Fragment>
  );
};

export default TaskMain;

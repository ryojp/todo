import React, { useContext } from "react";
import { List, Typography } from "@mui/material";
import { Container } from "@mui/system";
import TaskItem from "./TaskItem";
import { TaskType } from "./taskTypes";
import TaskContext from "../contexts/task-ocntext";

const TaskList: React.FC = () => {
  const taskCtx = useContext(TaskContext);

  if (taskCtx.tasks.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ pt: 5 }}>
        <Typography variant="h4" align="center">
          No Tasks Found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pt: 5 }}>
      <List>
        {taskCtx.tasks.map((task: TaskType) => {
          return <TaskItem key={task._id} task={task} />;
        })}
      </List>
    </Container>
  );
};

export default TaskList;

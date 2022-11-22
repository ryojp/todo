import React, { useContext } from "react";
import { List, Typography } from "@mui/material";
import { Container } from "@mui/system";
import TaskItem from "./TaskItem";
import { Task } from "../../types/task";
import TaskContext from "../../contexts/task-context";

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
        {taskCtx.tasks.map((task: Task) => {
          return <TaskItem key={task._id} task={task} />;
        })}
      </List>
    </Container>
  );
};

export default TaskList;

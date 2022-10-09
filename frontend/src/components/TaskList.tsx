import React from "react";
import { List, Typography } from "@mui/material";
import { Container } from "@mui/system";
import TaskItem from "./TaskItem";
import { TaskType } from "./taskTypes";

type PropsType = {
  tasks: TaskType[];
  onDeleteTask: (task: TaskType) => void;
  onEditTask: (task: TaskType) => void;
};

const TaskList: React.FC<PropsType> = (props) => {
  if (props.tasks.length === 0) {
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
        {props.tasks.map((task: TaskType) => {
          return (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={props.onDeleteTask}
              onEdit={props.onEditTask}
            />
          );
        })}
      </List>
    </Container>
  );
};

export default TaskList;

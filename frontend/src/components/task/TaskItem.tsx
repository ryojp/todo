import React, { useContext } from "react";
import {
  Button,
  Card,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Task } from "../../types/task";
import TaskContext from "../../contexts/task-context";
import useHttp from "../../hooks/useHttp";

type PropsType = {
  task: Task;
};

type FormValues = {
  name: string;
};

const TaskItem: React.FC<PropsType> = (props) => {
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { client } = useHttp();

  const taskCtx = useContext(TaskContext);

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    reset({ name: props.task.name });
  };

  const endEditing = (data: FormValues) => {
    const new_task_name = data.name;
    if (new_task_name !== props.task.name) {
      // only if the name changes
      editTaskHandler({ ...props.task, name: new_task_name });
    }
    setEditing(false);
  };

  // Handler for Edit button.
  const editTaskHandler = (task: Task) => {
    // send PUT request and update the task upon receiving a response
    client.put(`/tasks/${task._id}`, task).then(() => {
      taskCtx.updateTask(task);
    });
  };

  // Handler for Delete button.
  const deleteTaskHandler = (task: Task) => {
    // send DELETE request and delete the task up on reception from backend DB
    client.delete(`/tasks/${task._id}`).then(() => {
      taskCtx.deleteTask(task);
    });
  };

  if (editing) {
    return (
      <Card>
        <ListItem component="form" onSubmit={handleSubmit(endEditing)}>
          <TextField
            required
            label="New Task Name"
            defaultValue={props.task.name}
            {...register("name", { required: true })}
            style={{ minWidth: "80%" }}
          />
          <Button type="submit" style={{ minWidth: "0px" }}>
            <ListItemIcon style={{ minWidth: "0px" }}>
              <CheckIcon />
            </ListItemIcon>
          </Button>
          <Button onClick={cancelEditing} style={{ minWidth: "0px" }}>
            <ListItemIcon style={{ minWidth: "0px" }}>
              <CloseIcon />
            </ListItemIcon>
          </Button>
        </ListItem>
      </Card>
    );
  } else {
    return (
      <Card>
        <ListItem>
          <ListItemText primary={props.task.name} />
          <Button onClick={startEditing} style={{ minWidth: "0px" }}>
            <ListItemIcon style={{ minWidth: "0px" }}>
              <EditIcon />
            </ListItemIcon>
          </Button>
          <Button
            onClick={() => deleteTaskHandler(props.task)}
            style={{ minWidth: "0px" }}
          >
            <ListItemIcon style={{ minWidth: "0px" }}>
              <BackspaceIcon />
            </ListItemIcon>
          </Button>
        </ListItem>
      </Card>
    );
  }
};

export default TaskItem;

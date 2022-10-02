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

const TaskItem = (props) => {
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    reset({ name: props.task.name });
  };

  const endEditing = (data) => {
    const new_task_name = data.name;
    if (new_task_name != props.task.name) {
      // only if the name changes
      console.log(data);
      props.onEdit({ ...props.task, name: new_task_name });
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <Card>
        <ListItem>
          <TextField
            required
            label="New Task Name"
            defaultValue={props.task.name}
            {...register("name")}
          />
          <Button
            onClick={handleSubmit(endEditing)}
            style={{ minWidth: "0px" }}
          >
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
            onClick={() => props.onDelete(props.task)}
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

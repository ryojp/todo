import React from "react";
import {
  Button,
  Card,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useForm } from "react-hook-form";

import useHttp from "../../hooks/useHttp";

type Props = {
  target: "username" | "password";
  username?: string;
  password?: string;
};

type FormValues = Props;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const UserProfileItem: React.FC<Props> = (props) => {
  const [editing, setEditing] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { client } = useHttp();

  const startEditing = () => {
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    reset({ username: props?.username, password: props?.password });
  };

  const endEditing = async (data: FormValues) => {
    if (data["target"] !== props["target"]) {
      // if changed
      try {
        await client.patch(`/auth/user?update=${props.target}`, data);
      } catch (err) {
        console.log(err);
      }
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <Card>
        <ListItem component="form" onSubmit={handleSubmit(endEditing)}>
          <TextField
            required
            label={capitalize(props.target)}
            defaultValue={props["target"]}
            {...register(props.target, { required: true })}
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
          <ListItemText primary={props[props["target"]]} />
          <Button onClick={startEditing} style={{ minWidth: "0px" }}>
            <ListItemIcon style={{ minWidth: "0px" }}>
              <EditIcon />
            </ListItemIcon>
          </Button>
        </ListItem>
      </Card>
    );
  }
};

export default UserProfileItem;

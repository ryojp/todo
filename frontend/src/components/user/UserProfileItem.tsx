import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  TextField,
  Typography,
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
  default?: string;
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
      <Card
        component="form"
        onSubmit={handleSubmit(endEditing)}
        sx={{ minWidth: 300 }}
      >
        <CardContent>
          <TextField
            required
            label={"New " + capitalize(props.target)}
            defaultValue={props.default}
            {...register(props.target, { required: true })}
          />
        </CardContent>
        <CardActions>
          <IconButton type="submit" style={{ minWidth: "0px" }}>
            <CheckIcon />
          </IconButton>
          <IconButton onClick={cancelEditing} style={{ minWidth: "0px" }}>
            <CloseIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  } else {
    return (
      <Card sx={{ minWidth: 300 }}>
        <CardContent>
          <Typography variant="caption">
            {capitalize(props["target"])}
          </Typography>
          <Typography variant="body1">{props[props["target"]]}</Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={startEditing} style={{ minWidth: "0px" }}>
            <EditIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
};

export default UserProfileItem;

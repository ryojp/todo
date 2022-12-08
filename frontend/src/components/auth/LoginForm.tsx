import React, { useContext, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  SnackbarCloseReason,
  TextField,
  Typography,
} from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useForm } from "react-hook-form";
import AuthContext from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";
import TaskContext from "../../contexts/task-context";
import useHttp from "../../hooks/useHttp";
import { Task } from "../../types/task";
import { AxiosError } from "axios";
import CustomSnackbar from "../CustomSnackbar";
import { Link } from "react-router-dom";

type FormValues = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);
  const { client, refreshIntercept } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (data: FormValues) => {
    setIsLoading(true);
    try {
      client.interceptors.response.eject(refreshIntercept);
      const res = await client.post("/auth/login", data);
      if (res.data.token && res.data.refreshToken) {
        authCtx.login(res.data.token, res.data.refreshToken, res.data.username);
        await loadTasks(res.data.token);
      }
      setIsLoading(false);
      reset({ username: "", password: "" });
      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        setErrorMessage(err.response?.data?.error || err.message);
      } else {
        setErrorMessage("Unknown error");
      }
      setIsLoading(false);
    }
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(handleLogin)();
  };

  const loadTasks = async (token: string) => {
    const authHead = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    setIsLoading(true);
    try {
      const res = await client.get<Task[]>("/tasks", authHead);
      taskCtx.setTasks(res.data);
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        setErrorMessage(err.response?.data?.error || err.message);
      } else {
        setErrorMessage("Unknown error");
      }
    }
    setIsLoading(false);
  };

  const handleCloseSnack = (
    _event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorMessage("");
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ pt: 5 }}>
      <Stack component="form" onSubmit={submitHandler} spacing={3}>
        <TextField
          label="Username"
          required
          {...register("username", { required: true })}
        />
        <TextField
          label="Passsword"
          type="password"
          required
          {...register("password", { required: true })}
        />
        <Button type="submit" variant="contained">
          Log in
        </Button>
        <Typography textAlign="center">
          New to this app?
          <Box component="span" sx={{ marginLeft: "2px" }}>
            <Link to="/auth/signup">Create an account</Link>
          </Box>
        </Typography>
      </Stack>
      <CustomSnackbar
        severity="error"
        message={errorMessage}
        open={errorMessage !== ""}
        handleClose={handleCloseSnack}
        showDuration={4000}
      />
    </Container>
  );
};

export default LoginForm;

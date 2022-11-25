import React, { useContext, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useForm } from "react-hook-form";
import AuthContext from "../../contexts/auth-context";
import { useNavigate } from "react-router-dom";
import TaskContext from "../../contexts/task-context";
import useHttp from "../../hooks/useHttp";

type FormValues = {
  username: string;
  password: string;
};

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [isLogin, setIsLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);
  const { client, refreshIntercept } = useHttp();

  const handleLogin = async (data: FormValues) => {
    try {
      client.interceptors.response.eject(refreshIntercept);
      const res = await client.post("/auth/login", data);
      if (res.data.token && res.data.refreshToken) {
        authCtx.login(res.data.token, res.data.refreshToken);
        loadTasks(res.data.token);
      }
      reset({ username: "", password: "" });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignup = async (data: FormValues) => {
    try {
      client.interceptors.response.eject(refreshIntercept);
      await client.post("/auth/signup", data);
      setIsLogin(true);
    } catch (err) {
      console.log(err);
    }
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      handleSubmit(handleLogin)();
    } else {
      handleSubmit(handleSignup)();
    }
  };

  const toggleAuthModeHandler = () => {
    setIsLogin((prev) => !prev);
  };

  const loadTasks = (token: string) => {
    const authHead = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    client.get("/tasks", authHead).then((response) => {
      taskCtx.setTasks(response.data);
    });
  };

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
          {isLogin ? "Log in" : "Sign up"}
        </Button>
        <Button type="button" variant="text" onClick={toggleAuthModeHandler}>
          {isLogin ? "Create a new account" : "Login with an existing account"}
        </Button>
      </Stack>
    </Container>
  );
};

export default AuthForm;

import React, { useContext, useState } from "react";
import { Button, TextField } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useForm } from "react-hook-form";
import AuthContext from "../../contexts/auth-context";
import client from "../../utils/api";
import { useNavigate } from "react-router-dom";

type FormValues = {
  username: string;
  password: string;
};

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [isLogin, setIsLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  const handleLogin = async (data: FormValues) => {
    try {
      const res = await client.post("/auth/login", data);
      if (res.data.token) {
        authCtx.login(res.data.token);
      }
      reset({ username: "", password: "" });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignup = async (data: FormValues) => {
    try {
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
          {isLogin ? "Create new account" : "Login with existing account"}
        </Button>
      </Stack>
    </Container>
  );
};

export default AuthForm;

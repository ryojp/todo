import React, { useContext } from "react";
import { Button, TextField } from "@mui/material";
import { Container, Stack } from "@mui/system";
import { useForm } from "react-hook-form";
import AuthContext from "../../contexts/auth-context";
import client from "../../utils/api";

type FormValues = {
  username: string;
  password: string;
};

const AuthForm: React.FC = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const authCtx = useContext(AuthContext);

  const handleLogin = async (data: FormValues) => {
    try {
      console.log(data);
      const res = await client.post("/auth/login", data);
      console.log(res.data);
      if (res.data.token) {
        authCtx.login(res.data.token);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(handleLogin)();
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
          required
          {...register("password", { required: true })}
        />
        <Button type="submit" variant="contained">
          Log in
        </Button>
      </Stack>
    </Container>
  );
};

export default AuthForm;

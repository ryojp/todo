import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import useHttp from "../../hooks/useHttp";
import { AxiosError } from "axios";
import CustomSnackbar from "../CustomSnackbar";
import { Link } from "react-router-dom";

type FormValues = {
  username: string;
  password: string;
};

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { client, refreshIntercept } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (data: FormValues) => {
    setIsLoading(true);
    try {
      client.interceptors.response.eject(refreshIntercept);
      await client.post("/auth/signup", data);
      setIsLoading(false);
      reset({ username: "", password: "" });
      navigate("/auth/login");
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
    handleSubmit(handleSignup)();
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
          Sign up
        </Button>
        <Typography textAlign="center">
          Already have an account?
          <Box component="span" sx={{ marginLeft: "2px" }}>
            <Link to="/auth/login">Sign in</Link>
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

export default SignupForm;

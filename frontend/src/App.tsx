import { CssBaseline, ThemeProvider } from "@mui/material";
import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import EditUserProfile from "./components/user/EditUserProfile";
import NavBar from "./layout/NavBar";
import theme from "./themes/theme";
import PrivateRoute from "./components/auth/PrivateRoute";
import TaskMain from "./components/task/TaskMain";

const App = () => {
  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Routes>
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/auth/signup" element={<SignupForm />} />
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<EditUserProfile />} />
            <Route path="/" element={<TaskMain />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;

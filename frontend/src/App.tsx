import { CssBaseline, ThemeProvider } from "@mui/material";
import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import Main from "./components/Main";
import NavBar from "./layout/NavBar";
import theme from "./themes/theme";

const App = () => {
  return (
    <Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Routes>
          <Route path="/auth/login" element={<LoginForm />} />
          <Route path="/auth/signup" element={<SignupForm />} />
          <Route path="/" element={<Main />} />
        </Routes>
      </ThemeProvider>
    </Fragment>
  );
};

export default App;

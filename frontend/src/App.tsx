import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import Main from "./components/Main";
import NavBar from "./layout/NavBar";

const App = () => {
  return (
    <Fragment>
      <NavBar />
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/" element={<Main />} />
      </Routes>
    </Fragment>
  );
};

export default App;

import React, { Fragment, useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../contexts/auth-context";
import NewTask from "./NewTask";
import TaskList from "./TaskList";

const Main: React.FC = () => {
  const authCtx = useContext(AuthContext);

  if (!authCtx.isLoggedIn) {
    return <Navigate to="/auth" />;
  }

  return (
    <Fragment>
      <NewTask />
      <TaskList />
    </Fragment>
  );
};

export default Main;

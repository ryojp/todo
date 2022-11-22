import { Fragment, useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AuthForm from "./components/auth/AuthForm";
import NewTask from "./components/NewTask";
import TaskList from "./components/TaskList";
import AuthContext from "./contexts/auth-context";
import TaskContext from "./contexts/task-context";
import NavBar from "./layout/NavBar";
import client from "./utils/api";

const App = () => {
  const taskCtx = useContext(TaskContext);
  const authCtx = useContext(AuthContext);

  const authHead = {
    headers: {
      Authorization: `Bearer ${authCtx.token}`,
    },
  };

  // For the first page hit, fetch every task from backend DB.
  useEffect(() => {
    client.get("/tasks", authHead).then((response) => {
      taskCtx.setTasks(response.data);
    });
  }, []);

  return (
    <Fragment>
      <NavBar />
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route
          path="/"
          element={
            <Fragment>
              <NewTask />
              <TaskList />
            </Fragment>
          }
        />
      </Routes>
    </Fragment>
  );
};

export default App;

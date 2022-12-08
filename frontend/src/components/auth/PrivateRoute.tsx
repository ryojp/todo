import { FC, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../contexts/auth-context";

const PrivateRoute: FC = () => {
  const authCtx = useContext(AuthContext);

  if (!authCtx.isLoggedIn) {
    return <Navigate to="/auth/login" replace={true} />;
  }

  return <Outlet />;
};

export default PrivateRoute;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext({
  token: "",
  refreshToken: "",
  isLoggedIn: false,
  login: (_token: string, _refreshToken: string) => {},
  logout: () => {},
  postRefresh: (_token: string) => {},
});

type Props = {
  children?: React.ReactNode;
};

export const AuthContextProvider: React.FC<Props> = (props) => {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const navigate = useNavigate();

  const loginHandler = (token: string, refreshToken: string) => {
    setToken(token);
    setRefreshToken(refreshToken);
  };

  const logoutHandler = () => {
    setToken("");
    setRefreshToken("");
    navigate("/auth/login", { replace: true });
  };

  const refreshTokenHandler = (token: string) => {
    setToken(token);
  };

  return (
    <AuthContext.Provider
      value={{
        token: token,
        refreshToken,
        isLoggedIn: !!token,
        login: loginHandler,
        logout: logoutHandler,
        postRefresh: refreshTokenHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

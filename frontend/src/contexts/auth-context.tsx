import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext({
  token: "",
  refreshToken: "",
  isLoggedIn: false,
  username: "",
  displayName: "",
  login: (_token: string, _refreshToken: string, _username: string) => {},
  logout: () => {},
  postRefresh: (_token: string) => {},
  updateUsername: (_username: string) => {},
});

type Props = {
  children?: React.ReactNode;
};

export const AuthContextProvider: React.FC<Props> = (props) => {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  const navigate = useNavigate();

  const loginHandler = (
    token: string,
    refreshToken: string,
    username: string
  ) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setUsername(username);
    setDisplayName(username);
  };

  const logoutHandler = () => {
    setToken("");
    setRefreshToken("");
    setUsername("");
    setDisplayName("");
    navigate("/auth/login", { replace: true });
  };

  const updateUsernameHandler = (username: string) => {
    setUsername(username);
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
        username,
        displayName,
        login: loginHandler,
        logout: logoutHandler,
        postRefresh: refreshTokenHandler,
        updateUsername: updateUsernameHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

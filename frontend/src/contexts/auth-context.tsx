import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (_: string) => {},
  logout: () => {},
});

type Props = {
  children?: React.ReactNode;
};

export const AuthContextProvider: React.FC<Props> = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");

  const loginHandler = (token: string) => {
    setToken(token);
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {};

  return (
    <AuthContext.Provider
      value={{ token, isLoggedIn, login: loginHandler, logout: logoutHandler }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

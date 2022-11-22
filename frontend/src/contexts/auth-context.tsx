import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [token, setToken] = useState("");

  const navigate = useNavigate();

  const loginHandler = (token: string) => {
    setToken(token);
  };

  const logoutHandler = () => {
    setToken("");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        token: token,
        isLoggedIn: !!token,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

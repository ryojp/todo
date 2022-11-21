import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  //token:
  //  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwiaWF0IjoxNjY5MDQ1Mjg3LCJleHAiOjE2NjkwNDg4ODcsImlzcyI6ImdpdGh1Yi5jb20vcnlvanAvdG9kbzpkZXZlbG9wbWVudCJ9.QaWN4hidgOPVvncL34G03BWG_CQS1KVczvgYdSb5y2o",
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

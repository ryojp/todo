import axios from "axios";

import { useContext } from "react";
import AuthContext from "../contexts/auth-context";
//import client from "../utils/api";

// type HttpState = {
//   loading: boolean;
//   error?: Error;
//   data?: any;
// };
//
// export type HttpAction = {
//   type: "getAll" | "post" | "get" | "put" | "delete";
//   payload?: any;
// };
//
// const initialState: HttpState = {
//   loading: false,
// };
//
// const reducer: Reducer<HttpState, HttpAction> = (
//   state: HttpState,
//   action: HttpAction
// ) => {
//   switch (action.type) {
//     case "getAll":
//   }
//   return state;
// };

const useHttp = () => {
  //const [state, dispatch] = useReducer(reducer, initialState);
  const authCtx = useContext(AuthContext);

  const client = axios.create({
    baseURL: process.env["REACT_APP_API_URL"] || "/api",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authCtx.token}`,
    },
  });

  return {
    client,
    //...state,
    //dispatch,
  };
};

export default useHttp;

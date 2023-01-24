import axios, { AxiosError, AxiosRequestConfig } from "axios";

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

  const refresh = async () => {
    const res = await client.post("/auth/token", {
      refresh_token: authCtx.refreshToken,
    });
    return res.data?.token;
  };

  const refreshIntercept = client.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
      if (!err.config) {
        return Promise.reject(err);
      }
      const originalConfig: AxiosRequestConfig & { _retry?: boolean } =
        err.config;
      if (err.response?.status === 401 && !originalConfig?._retry) {
        originalConfig._retry = true;
        try {
          const token = await refresh();
          if (!token) {
            return Promise.reject(err);
          }
          authCtx.postRefresh(token);
          return client({
            ...originalConfig,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (_err) {
          return Promise.reject(_err);
        }
      }
      return Promise.reject(err);
    }
  );

  return {
    client,
    refreshIntercept,
    //...state,
    //dispatch,
  };
};

export default useHttp;

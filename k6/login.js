import http from "k6/http";
import { sleep } from "k6";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.0001"],
  },
};

export default () => {
  const url = __ENV.URL || "http://localhost:8080";
  const username = __ENV.TODOUSER || "loadtester";
  const payload = JSON.stringify({
    username: username,
    password: __ENV.TODOPASS,
  });
  const params = {
    headers: {
      "content-type": "application/json",
    },
  };
  http.post(url, payload, params);
  sleep(1);
};

import http from "k6/http";
import { check, sleep } from "k6";

const baseUrl = __ENV.BASE_URL || "http://localhost:8080";

export const options = {
  thresholds: {
    http_req_failed: ["rate<0.0001"],
  },
};

export const login = () => {
  const url = `${baseUrl}/api/auth/login`;
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
  const res = http.post(url, payload, params);
  check(res, {
    "status was 200": (r) => r.status == 200,
  });
  sleep(1);
};

export const index = () => {
  const url = baseUrl;
  http.get(url);
  // sleep(1);
};

export default () => {
  login();
  // index();
};

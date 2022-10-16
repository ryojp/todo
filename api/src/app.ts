import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import routes from "./routes/routes";
import { validate } from "./env";

if (!validate()) {
  console.log("Make sure all the env values are set.");
  process.exit(1);
}

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

routes(app);

app.get("/");

export default app;

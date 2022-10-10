import express from "express";
import bodyParser from "body-parser";

import routes from "./routes/taskRoute";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.get("/");

export default app;

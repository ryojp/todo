import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

import routes from "./routes/taskRoute";

const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: [process.env['FRONTEND_URL'] as string],
  methods: 'GET, POST, PUT, PATCH, DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

routes(app);

app.get("/");

export default app;

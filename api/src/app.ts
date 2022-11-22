import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { router as authRoutes } from "./routes/auth";
import { router as taskRoutes } from "./routes/task";
import { validate } from "./env";
import { errorHandler } from "./middleware/error";

if (!validate()) {
  console.log("Make sure all the env values are set.");
  process.exit(1);
}

const app = express();

app.use(bodyParser.json());

app.use(
  cors({
    origin: [process.env["FRONTEND_URL"] as string],
    methods: "GET, POST, PUT, PATCH, DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.use(errorHandler);

export default app;

import mongoose from "mongoose";

import app from "./app";

const port = 5000;

const mongoURL = process.env.MONGODB_URL || "";
const mongoUser = process.env.MONGODB_USER || "";
const mongoPass = process.env.MONGODB_PASS || "";
const mongoDBName = process.env.MONGODB_DBNAME || "";

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoURL, {
    user: mongoUser,
    pass: mongoPass,
    dbName: mongoDBName,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Error connecting to the database\n" + err);
  });

app.listen(port, () => {
  console.log("Todo list RESTful API server listening on: " + port);
});

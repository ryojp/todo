import mongoose from "mongoose";

import app from "./app";

const port: number = +(process.env.API_SERVER_PORT as string);

const mongoURL = process.env.MONGODB_URL as string;
const mongoUser = process.env.MONGODB_USER as string;
const mongoPass = process.env.MONGODB_PASS as string;
const mongoDBName = process.env.MONGODB_DBNAME as string;

if (!mongoURL || !mongoUser || !mongoPass || !mongoDBName) {
  console.log("Environment variables are not set, dying!")
  process.exit(1);
}

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

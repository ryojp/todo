import mongoose from "mongoose";

import app from "./app";
import { mongoURL, mongoUser, mongoPass, mongoDBName } from "./env";

const port = +(process.env.PORT || "4000");

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

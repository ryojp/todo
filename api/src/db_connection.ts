import mongoose from "mongoose";
import { mongoURL, mongoUser, mongoPass, mongoDBName } from "./env";

let _retry = 5;

const connect_with_retry = () => {
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
      console.log(err);
      if (_retry-- <= 0) {
        console.log("Error connecting to DB");
        process.exit(1);
      }
      console.log("Retrying DB connection...");
      setTimeout(connect_with_retry, 1000);
    });
};

export const db_connection = () => {
  mongoose.Promise = global.Promise;
  mongoose.set("strictQuery", true);
  connect_with_retry();
};

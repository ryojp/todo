import app from "./app";
import { db_connection } from "./db_connection";

const port = +(process.env.PORT || "4000");

db_connection();

app.listen(port, () => {
  console.log("Todo list RESTful API server listening on: " + port);
});

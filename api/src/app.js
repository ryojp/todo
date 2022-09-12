const express = require("express");
const bodyParser = require("body-parser");

const Task = require("./models/taskModel");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const routes = require("./routes/taskRoute");
routes(app);

app.get("/");

module.exports = app;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: "Enter the name of the task",
  },
  Created_date: {
    type: Date,
    defualt: Date.now,
  },
});

module.exports = mongoose.model("Tasks", TaskSchema);

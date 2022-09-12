const mongoose = require("mongoose");
const request = require("supertest");

const Task = require("../src/models/taskModel");
const app = require("../src/app");

describe("Test /tasks endpoints", () => {
  mongoose.Promise = global.Promise;

  // connect to MongoDB before running each test case
  beforeEach(async () => {
    await mongoose
      .connect("mongodb://mongo-test/", {
        auth: { authSource: "TestDB" },
        user: "testuser",
        pass: "testpass",
      })
      .catch((err) => {
        console.log("Error connecting to the database\n" + err);
      });
  });

  // drop MongoDB and close connection after running each test case
  afterEach((done) => {
    Task.remove({}, async (err) => {
      await mongoose.disconnect();
      done();
    });
  });

  it("GET /tasks", async () => {
    const task = await Task.create({ name: "Example" });

    await request(app)
      .get("/tasks")
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toEqual(1);

        // Check data
        expect(response.body[0]._id).toBe(task.id);
        expect(response.body[0].name).toBe(task.name);
      });
  });

  it("POST /tasks", async () => {
    const data = { name: "Sample" };

    const response = await request(app)
      .post("/tasks")
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBeTruthy();
        expect(response.body.name).toBe(data.name);

        // Check data in the database
        const task = await Task.findOne({ _id: response.body._id });
        expect(task).toBeTruthy();
        expect(task.name).toBe(data.name);
      });
  });

  it("GET /tasks/:taskId", async () => {
    const task = await Task.create({ name: "Example" });

    await request(app)
      .get(`/tasks/${task.id}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBe(task.id);
        expect(response.body.name).toBe(task.name);
      });
  });

  it("PUT /tasks/:taskId", async () => {
    const task = await Task.create({ name: "Example" });

    const data = { name: "Updated Name" };

    await request(app)
      .put(`/tasks/${task.id}`)
      .send(data)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBe(task.id);
        expect(response.body.name).toBe(data.name);

        // Check the data in the database
        const newtask = await Task.findOne({ _id: response.body._id });
        expect(newtask).toBeTruthy();
        expect(newtask.name).toBe(data.name);
      });
  });

  it("DELETE /tasks/:taskId", async () => {
    const task = await Task.create({ name: "Example" });

    await request(app)
      .delete(`/tasks/${task.id}`)
      .expect(200)
      .then(async () => {
        expect(await Task.findOne({ _id: task._id })).toBeFalsy();
      });
  });
});
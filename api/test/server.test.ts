import mongoose from "mongoose";
import request from "supertest";
import Task from "../src/models/taskModel";
import app from "../src/app";
import { mongoURL, mongoUser, mongoPass, mongoDBName } from "../src/env";
import User from "../src/models/userModel";

// Define an agent to store the cookie (containing JWT)
const agent = request.agent(app);

describe("Test auth and /tasks endpoints", () => {
  mongoose.Promise = global.Promise;

  // Connect to MongoDB before running each test case
  // Create a test user and login
  beforeEach(async () => {
    await mongoose
      .connect(mongoURL, {
        user: mongoUser,
        pass: mongoPass,
        dbName: mongoDBName,
      })
      .catch((err) => {
        console.log("Error connecting to the database\n" + err);
      });

    const testUser = { username: "testuser", password: "pass" };

    // Sign up if not done yet
    const exists = await User.findByUsername(testUser.username);
    if (!exists) {
      await agent.post("/signup").send(testUser).expect(200);
      console.log("Created a test user.");
    }

    // Login
    const res = await agent.post("/login").send(testUser).expect(200);
    try {
      agent.saveCookies(res);
    } catch (err) {
      console.log(err);
    }
  });

  // Drop MongoDB and close connection after running each test case
  afterEach((done) => {
    Task.deleteMany({}, async () => {
      await mongoose.disconnect();
      done();
    });
  });

  it("GET /tasks", async () => {
    const task = await Task.create({ name: "Example" });

    return agent
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

    return agent
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
        expect(task?.name).toBe(data.name);
      });
  });

  it("GET /tasks/:taskId", async () => {
    const task = await Task.create({ name: "Example" });

    return agent
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

    return agent
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
        expect(newtask?.name).toBe(data.name);
      });
  });

  it("DELETE /tasks/:taskId", async () => {
    const task = await Task.create({ name: "Example" });

    return agent
      .delete(`/tasks/${task.id}`)
      .expect(200)
      .then(async () => {
        expect(await Task.findOne({ _id: task._id })).toBeFalsy();
      });
  });

  it("Duplicate username for /signup", async () => {
    const user2 = { username: "testuser", password: "another" };
    const res = await agent.post("/signup").send(user2);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty("err"); // should receive an error message
  });
});

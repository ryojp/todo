import mongoose, { Schema } from "mongoose";
import request from "supertest";
import Task from "../src/models/task";
import app from "../src/app";
import { mongoURL, mongoUser, mongoPass, mongoDBName } from "../src/env";
import User, { IUserDoc } from "../src/models/auth";

// Define an agent to store the cookie (containing JWT)
const agent = request.agent(app);

describe("Test auth and /tasks endpoints", () => {
  mongoose.Promise = global.Promise;
  let token: string;
  let user: IUserDoc & { _id: Schema.Types.ObjectId };

  // Connect to MongoDB before running each test case
  // Create a test user and login
  beforeAll(async () => {
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
    const exists = await User.findOne({ username: testUser.username });
    if (!exists) {
      user = await User.create(testUser);
      console.log("Created a test user.");
    } else {
      user = exists;
    }

    // Login
    const res = await agent.post("/auth/login").send(testUser).expect(200);
    try {
      token = res.body.token;
    } catch (err) {
      console.log(err);
    }
  });

  // Drop Task collection after running each test case
  afterEach((done) => {
    Task.deleteMany({}, async () => {
      done();
    });
  });

  // Delete the test user and disconnect from the MongoDB
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it("GET /tasks", async () => {
    const task = await Task.create({ name: "Example", creatorId: user._id });
    user.tasks.push(task._id);
    await user.save();

    return agent
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`)
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
      .set("Authorization", `Bearer ${token}`)
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
    const task = await Task.create({ name: "Example", creatorId: user._id });

    return agent
      .get(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBe(task.id);
        expect(response.body.name).toBe(task.name);
      });
  });

  it("PUT /tasks/:taskId", async () => {
    const task = await Task.create({ name: "Example", creatorId: user._id });

    const data = { name: "Updated Name" };

    return agent
      .put(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
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
    const task = await Task.create({ name: "Example", creatorId: user._id });

    return agent
      .delete(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .then(async () => {
        expect(await Task.findOne({ _id: task._id })).toBeFalsy();
      });
  });

  it("Duplicate username for /auth/signup", async () => {
    const user2 = { username: "testuser", password: "another" };
    const res = await agent.post("/auth/signup").send(user2);
    expect(res.status).toEqual(500);
    expect(res.body).toHaveProperty("error"); // should receive an error message
  });
});

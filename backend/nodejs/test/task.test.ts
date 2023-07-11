import mongoose from "mongoose";
import request from "supertest";
import Task from "../src/models/task";
import app from "../src/app";
import { mongoURL, mongoUser, mongoPass, mongoDBName } from "../src/env";
import User, { IUserDoc } from "../src/models/auth";

const agent = request.agent(app);

describe("Test /tasks endpoints", () => {
  mongoose.Promise = global.Promise;
  mongoose.set('strictQuery', true);

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
  });

  const _createUser = async (
    username: string,
    password: string
  ): Promise<{
    user: IUserDoc & {
      _id: mongoose.Types.ObjectId;
    };
    token: string;
  }> => {
    // create user
    const _user = await User.create({ username, password });
    // Login
    const res = await agent
      .post("/auth/login")
      .send({ username, password })
      .expect(200);
    const _token = res.body.token;
    return { user: _user, token: _token };
  };

  // Delete the test user and disconnect from the MongoDB
  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await mongoose.disconnect();
  });

  test("GET /tasks", async () => {
    const res = await _createUser("testuser0", "asdfASDF1234");

    const task = await Task.create({
      name: "Example 1",
      creatorId: res.user._id,
    });
    res.user.tasks.push(task._id);
    await res.user.save();

    return agent
      .get("/tasks")
      .set("Authorization", `Bearer ${res.token}`)
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

  test("POST /tasks", async () => {
    const res = await _createUser("testuser1", "asdfASDF1234");
    const data = { name: "Sample" };

    return agent
      .post("/tasks")
      .set("Authorization", `Bearer ${res.token}`)
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

  test("GET /tasks/:taskId", async () => {
    const res = await _createUser("testuser2", "asdfASDF1234");
    const task = await Task.create({
      name: "Example 2",
      creatorId: res.user._id,
    });

    return agent
      .get(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${res.token}`)
      .expect(200)
      .then(async (response) => {
        // Check the response
        expect(response.body._id).toBe(task.id);
        expect(response.body.name).toBe(task.name);
      });
  });

  test("PUT /tasks/:taskId", async () => {
    const res = await _createUser("testuser3", "asdfASDF1234");
    const task = await Task.create({
      name: "Example 3",
      creatorId: res.user._id,
    });

    const data = { name: "Updated Name" };

    return agent
      .put(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${res.token}`)
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

  test("DELETE /tasks/:taskId", async () => {
    const res = await _createUser("testuser4", "asdfASDF1234");
    const task = await Task.create({
      name: "Example 4",
      creatorId: res.user._id,
    });

    return agent
      .delete(`/tasks/${task.id}`)
      .set("Authorization", `Bearer ${res.token}`)
      .expect(200)
      .then(async () => {
        expect(await Task.findOne({ _id: task._id })).toBeFalsy();
      });
  });
});

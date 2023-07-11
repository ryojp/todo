import request from "supertest";
import mongoose from "mongoose";
import User, {
  LOGIN_LOCK_TIME_MS,
  LoginResult,
  MAX_LOGIN_ATTEMPTS,
} from "../src/models/auth";
import { mongoURL, mongoUser, mongoPass, mongoDBName } from "../src/env";
import app from "../src/app";
import Task from "../src/models/task";

const agent = request.agent(app);

describe("Test User DB and /auth endpoints", () => {
  mongoose.Promise = global.Promise;
  mongoose.set("strictQuery", true);

  // Connect to MongoDB before running each test case
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
  });

  // Drop MongoDB and close connection after running each test case
  afterEach(async () => {
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  test("Authentication just after creation", async () => {
    const username = "john1";
    const password = "abcABC123";
    await User.create({ username, password });

    let result: LoginResult;

    // ground truth
    result = await User.getAuthenticated(username, password);
    expect(result).toBe(LoginResult.SUCCESS);

    // incorrect username
    result = await User.getAuthenticated(username + " lobb", password);
    expect(result).toBe(LoginResult.NOT_FOUND);

    // incorrect password
    result = await User.getAuthenticated(username, password + "def");
    expect(result).toBe(LoginResult.PASSWORD_INCORRECT);
  });

  test("Unlock from too many trials", async () => {
    const username = "john2";
    const password = "abcABC123";
    await User.create({ username, password });

    let result: LoginResult;

    // repeat trying to login with incorrect passwords
    for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
      result = await User.getAuthenticated(username, password + i);
      expect(result).toBe(LoginResult.PASSWORD_INCORRECT);
    }

    // should be locked; correct password should not work now
    result = await User.getAuthenticated(username, password);
    expect(result).toBe(LoginResult.MAX_ATTEMPTS);

    // update Date.now()
    const current_time_ms = Date.now();
    Date.now = jest.fn(() => current_time_ms + LOGIN_LOCK_TIME_MS);

    // should NOT be locked now
    result = await User.getAuthenticated(username, password);
    expect(result).toBe(LoginResult.SUCCESS);
  });

  test("Too many failed logins", async () => {
    const username = "john3";
    const password = "abcABC123";
    await User.create({ username, password });

    let result: LoginResult;

    // repeat trying to login with incorrect passwords
    for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
      result = await User.getAuthenticated(username, password + i);
      expect(result).toBe(LoginResult.PASSWORD_INCORRECT);
    }

    // should be locked; correct password should not work now
    result = await User.getAuthenticated(username, password);
    expect(result).toBe(LoginResult.MAX_ATTEMPTS);

    // of course, an incorrect password is not accepted
    result = await User.getAuthenticated(username, "incorrect pass");
    expect(result).toBe(LoginResult.MAX_ATTEMPTS);
  });

  test("Authentication after updating password", async () => {
    const username = "john4";
    const password = "abcABC123";
    const user = await User.create({ username, password });

    // update password
    const new_pass = "def";
    user.password = new_pass;
    await user.save();

    let result: LoginResult;

    // ground truth
    result = await User.getAuthenticated(username, new_pass);
    expect(result).toBe(LoginResult.SUCCESS);

    // old password
    result = await User.getAuthenticated(username, password);
    expect(result).toBe(LoginResult.PASSWORD_INCORRECT);
  });

  test("Delete user", async () => {
    const username = "john5";
    const password = "abcABC123";

    // create a user
    await agent.post("/auth/signup").send({ username, password }).expect(201);

    // obtain the user ID (for later use)
    const user = await User.findOne({ username });
    expect(user).toBeTruthy();
    const userId = user?._id;

    // obtain a token
    const res = await agent
      .post("/auth/login")
      .send({ username, password })
      .expect(200);
    const token = res.body.token;

    // create some dummy tasks
    await agent
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "dummy task0" })
      .expect(200);
    await agent
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "dummy task1" })
      .expect(200);

    // delete the user
    await agent
      .delete("/auth/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // assert the user is deleted from the DB
    expect(await User.findOne({ username })).toBeFalsy();

    // assert the related tasks are deleted from the DB
    expect(await Task.find({ creatorId: userId })).toHaveLength(0);
  });

  test("Duplicate username for /auth/signup", async () => {
    await agent
      .post("/auth/signup")
      .send({ username: "john6", password: "asdfASDF1234" })
      .expect(201);

    const res = await agent
      .post("/auth/signup")
      .send({ username: "john6", password: "asdfASDF1234" });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty("error"); // should receive an error message
  });

  test("Unknown username in /auth/login", async () => {
    const username = "john7";
    const password = "abcABC123";

    // create a user
    await agent.post("/auth/signup").send({ username, password }).expect(201);

    await agent
      .post("/auth/login")
      .send({ username: "someoneElse", password })
      .expect(401);
  });

  test("Max login attempt in /auth/login", async () => {
    const username = "john8";
    const password = "abcABC123";

    // create a user
    await agent.post("/auth/signup").send({ username, password }).expect(201);

    // repeatedly fail to login
    let i = 0;
    for (; i < MAX_LOGIN_ATTEMPTS; i++) {
      await agent
        .post("/auth/login")
        .send({ username, password: password + i })
        .expect(401);
    }

    // expect max login attempt reached, even with correct credentials
    await agent.post("/auth/login").send({ username, password }).expect(429);
    await agent
      .post("/auth/login")
      .send({ username, password: password + i })
      .expect(429);
  });

  test("Success in /auth/refresh", async () => {
    const username = "john9";
    const password = "abcABC123";

    // create a user
    await agent.post("/auth/signup").send({ username, password }).expect(201);

    // obtain a token and a refresh_token
    const res = await agent
      .post("/auth/login")
      .send({ username, password })
      .expect(200);
    const refreshToken = res.body.refreshToken;
    const token = res.body.token;

    // issue token-refresh request
    const res2 = await agent
      .post("/auth/token")
      .set("Authorization", `Bearer ${token}`)
      .send({ refresh_token: refreshToken })
      .expect(200);

    // assert the response contains both the token and refresh_token
    expect(res2.body.token).toBeTruthy();
    expect(res2.body.refreshToken).toBeTruthy();
  });

  test("Success in updating username at /auth/update", async () => {
    const username = "john10";
    const password = "abcABC123";

    // create a user
    await agent.post("/auth/signup").send({ username, password }).expect(201);

    // obtain a token
    const res = await agent
      .post("/auth/login")
      .send({ username, password })
      .expect(200);
    const token = res.body.token;

    await agent
      .patch("/auth/user?update=username")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: username + "_new" })
      .expect(204);
  });

  test("Success in updating password at /auth/update", async () => {
    const username = "john11";
    const password = "abcABC123";

    // create a user
    await agent.post("/auth/signup").send({ username, password }).expect(201);

    // obtain a token
    const res = await agent
      .post("/auth/login")
      .send({ username, password })
      .expect(200);
    const token = res.body.token;

    await agent
      .patch("/auth/user?update=password")
      .set("Authorization", `Bearer ${token}`)
      .send({ password: password + "_new" })
      .expect(204);
  });

  test("Success in getting user info at /auth/user", async () => {
    const username = "john12";
    const password = "abcABC123";

    // create a user
    await agent.post("/auth/signup").send({ username, password }).expect(201);

    // obtain a token
    const _res = await agent
      .post("/auth/login")
      .send({ username, password })
      .expect(200);
    const token = _res.body.token;

    const res = await agent
      .get("/auth/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.username).toEqual(username);
  });
});

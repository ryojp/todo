import mongoose from "mongoose";
import User, {
  LOGIN_LOCK_TIME_MS,
  LoginResult,
  MAX_LOGIN_ATTEMPTS,
} from "../src/models/userModel";
import { mongoURL, mongoUser, mongoPass, mongoDBName } from "../src/env";

describe("Test User DB", () => {
  mongoose.Promise = global.Promise;

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
  afterEach((done) => {
    User.deleteMany({}, async () => {
      await mongoose.disconnect();
      done();
    });
  });

  it("Authentication just after creation", async () => {
    const username = "john";
    const password = "abc";
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

  it("Unlock from too many trials", async () => {
    const username = "john";
    const password = "abc";
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

  it("Too many failed logins", async () => {
    const username = "john";
    const password = "abc";
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

  it("Authentication after updating password", async () => {
    const username = "john";
    const password = "abc";
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
});

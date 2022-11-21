import User, { IUserDoc, LoginResult } from "../models/auth";
import { Request, Response } from "express";
import { sign, SignOptions } from "jsonwebtoken";
import { nodeEnv, jwtSecret } from "../env";

// JWT Sign options
export const signOptions: SignOptions = {
  algorithm: "HS256",
  expiresIn: "1hr",
  issuer: `github.com/ryojp/todo:${nodeEnv}`,
};

type AuthRespPayload = {
  username?: string;
  token?: string;
  err?: string;
};

// Create a new user
export const signup = async (req: Request, res: Response<AuthRespPayload>) => {
  try {
    const { username, password } = req.body;
    await User.create({ username, password });
    res.status(201).send({ username });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.send({ err: "Unable to create a user" });
    }
    return;
  }
};

// Authenticate a user and return a JWT if success
export const login = async (req: Request, res: Response<AuthRespPayload>) => {
  try {
    const { username, password } = req.body;
    const result = await User.getAuthenticated(username, password);
    switch (result) {
      case LoginResult.SUCCESS:
        // generate JWT and store it in cookie with http-only and secure (if prod)
        const token = sign({ username }, jwtSecret, signOptions);
        res.send({ username, token });
        break;
      case LoginResult.MAX_ATTEMPTS:
        throw new Error("Too many failed attempts. Try again in hours.");
        break;
      default:
        throw new Error("Incorrect credentials");
        break;
    }
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      res.send({ err: err.message });
    }
    return;
  }
};

// Get the user with the given username
export const getUser = async (
  req: Request<{ username: string }>,
  res: Response<IUserDoc | { err: string }>
) => {
  const user = await User.findByUsername(req.params.username);
  if (!user) {
    res.json({ err: "No such username" });
    return;
  }
  res.json(user);
};

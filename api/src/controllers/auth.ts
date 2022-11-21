import User, { IUserDoc, LoginResult } from "../models/auth";
import { NextFunction, Request, Response } from "express";
import { sign, SignOptions } from "jsonwebtoken";
import { nodeEnv, jwtSecret } from "../env";
import { HttpError } from "../middleware/error";

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
export const signup = async (
  req: Request,
  res: Response<AuthRespPayload>,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    await User.create({ username, password });
    res.status(201).send({ username });
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      return next(new HttpError("Unable to create a user", 500));
    }
    return;
  }
};

// Authenticate a user and return a JWT if success
export const login = async (
  req: Request,
  res: Response<AuthRespPayload>,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const result = await User.getAuthenticated(username, password);
    switch (result) {
      case LoginResult.SUCCESS:
        // generate JWT and store it in cookie with http-only and secure (if prod)
        const token = sign({ username }, jwtSecret, signOptions);
        return res.send({ username, token });
      case LoginResult.MAX_ATTEMPTS:
        return next(
          new HttpError("Too many failed attempts. Try again in hours.", 429)
        );
      default:
        return next(new HttpError("Incorrect credentials", 401));
    }
  } catch (err) {
    console.log(err);
    if (err instanceof Error) {
      next(err);
    }
  }
};

// Get the user with the given username
export const getUser = async (
  req: Request<{ username: string }>,
  res: Response<IUserDoc | { err: string }>,
  next: NextFunction
) => {
  const user = await User.findByUsername(req.params.username);
  if (!user) {
    return next(new HttpError("No such username", 401));
  }
  res.json(user);
};

import User, { IUserDoc, LoginResult } from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { sign, SignOptions, verify, VerifyOptions, Algorithm } from "jsonwebtoken";
import { nodeEnv, jwtSecret } from "../env";

// JWT Sign options
const signOptions: SignOptions = {
  algorithm: "HS256",
  expiresIn: "1hr",
  issuer: `github.com/ryojp/todo:${nodeEnv}`,
};

// JWT Verify options
const verifyOptions: VerifyOptions = {
  algorithms: [signOptions.algorithm] as Algorithm[],
  issuer: signOptions.issuer,
};

type AuthRespPayload = {
  username?: string;
  token?: string;
  err?: string;
}

// Create a new user
export const createUser = async (
  req: Request,
  res: Response<AuthRespPayload>
) => {
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
export const authenticate = async (
  req: Request,
  res: Response<AuthRespPayload>
) => {
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
        throw Error("Too many failed attempts. Try again in hours.");
        break;
      default:
        throw Error("Incorrect credentials");
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

// Verify the token sent as a cookie
export const verifyToken = (
  req: Request,
  res: Response<{ err: string }>,
  next: NextFunction
) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw Error("No Authorization header found");
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw Error("Authorization token is not provided");
    }
    verify(token, jwtSecret, verifyOptions);
    next();
  } catch (err) {
    console.log(err);
    res.json({ err: "You are not aurothorized for this endpoint." });
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

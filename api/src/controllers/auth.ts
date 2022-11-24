import User, { IUserDoc, LoginResult } from "../models/auth";
import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { jwtSecret } from "../env";
import { HttpError } from "../middleware/error";
import { signOptions, verifyOptions } from "./jwt_options";

type AuthRespPayload = {
  username?: string;
  token?: string;
  refreshToken?: string;
  err?: string;
};

type TokenPayload = {
  userId: string;
  username: string;
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
    const user = await User.findOne({ username });
    if (!user) {
      return next(new HttpError("Incorrect credentials", 401));
    }

    const result = await user.getAuthenticated(password);
    switch (result) {
      case LoginResult.SUCCESS:
        // generate JWT and store it in cookie with http-only and secure (if prod)
        const payload: TokenPayload = { username, userId: user._id.toString() };
        const token = sign(payload, jwtSecret, signOptions);
        const refreshToken = sign(payload, jwtSecret, {
          ...signOptions,
          expiresIn: "7d",
        });
        return res.send({
          username,
          token,
          refreshToken,
        });
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

// Issue a new token once the given refresh_token is confirmed valid
export const refresh = async (
  req: Request & { username?: string; userId?: string },
  res: Response<AuthRespPayload>,
  next: NextFunction
) => {
  try {
    const { refresh_token } = req.body;

    verify(refresh_token, jwtSecret, verifyOptions, (err, decoded) => {
      if (err || !decoded) return next(new HttpError("Invalid token", 401));
      req.username = (decoded as JwtPayload).username; // extract from JWT
      req.userId = (decoded as JwtPayload).userId; // extract from JWT
    });

    const user = await User.findById(req.userId);
    if (!user) {
      return next(new HttpError("Incorrect credentials", 401));
    }
    if (!req.username) {
      return next(new HttpError("Username not found", 401));
    }

    const payload: TokenPayload = {
      username: req.username,
      userId: user._id.toString(),
    };
    const token = sign(payload, jwtSecret, signOptions);
    return res.send({
      username: req.username,
      token,
    });
  } catch (err) {
    return next(new HttpError("Invalid request", 400));
  }
};

// Get the user with the given username
export const getUser = async (
  req: Request<{ username: string }>,
  res: Response<IUserDoc | { err: string }>,
  next: NextFunction
) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return next(new HttpError("No such username", 401));
  }
  res.json(user);
};

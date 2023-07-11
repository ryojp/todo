import User, { IUserDoc, LoginResult } from "../models/auth";
import { NextFunction, Request, Response } from "express";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { jwtSecret } from "../env";
import { HttpError } from "../middleware/error";
import {
  refreshTokenExpiresIn,
  signOptions,
  verifyOptions,
} from "./jwt_options";
import Task from "../models/task";

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
          expiresIn: refreshTokenExpiresIn,
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
  req: Request,
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
      refreshToken: refresh_token, // do not update for now
      token,
    });
  } catch (err) {
    return next(new HttpError("Invalid request", 400));
  }
};

// Update user profile
export const updateUser = async (
  req: Request,
  res: Response<AuthRespPayload>,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return next(new HttpError("userId not found from Request", 400));
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new HttpError("User not found", 400));
    }

    switch (req.query?.update) {
      case "username":
        const { username } = req.body;
        if (!username) {
          return next(new HttpError("Invalid request body", 400));
        }
        user.username = username;
        break;
      case "password":
        const { password } = req.body;
        if (!password) {
          return next(new HttpError("Invalid request body", 400));
        }
        user.password = password;
        break;
      default:
        return next(new HttpError("Invalid update type", 400));
    }

    await user.save();
    res.status(204).send();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Failed to update the user profile", 500));
  }
};

// Get the user info
export const getUser = async (
  req: Request,
  res: Response<{ username: string } | { err: string }>,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return next(new HttpError("userId not found from Request", 400));
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new HttpError("User not found", 400));
    }
    return res.json({ username: user.username });
  } catch (err) {
    return next(err);
  }
};

// Delete the user
export const deleteUser = async (
  req: Request,
  res: Response<IUserDoc | { err: string }>,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return next(new HttpError("userId not found from Request", 400));
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return next(new HttpError("User not found", 400));
    }
    await Task.deleteMany({ creatorId: req.userId });
    await User.deleteOne({_id: req.userId});

    return res.json({ err: "Successfully deleted the user" });
  } catch (err) {
    return next(err);
  }
};

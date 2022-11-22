import { NextFunction, Request, Response } from "express";
import { verify, VerifyOptions, Algorithm, JwtPayload } from "jsonwebtoken";

import { jwtSecret } from "../env";
import { signOptions } from "../controllers/auth";
import { HttpError } from "./error";

// JWT Verify options
const verifyOptions: VerifyOptions = {
  algorithms: [signOptions.algorithm] as Algorithm[],
  issuer: signOptions.issuer,
};

// Verify the token sent as a cookie
export const verifyToken = (
  req: Request & { username?: string },
  _: Response,
  next: NextFunction
) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return next(new HttpError("No Authorization header found", 401));
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new HttpError("Authorization token is not provided", 401));
  }
  verify(token, jwtSecret, verifyOptions, (err, decoded) => {
    if (err || !decoded) return next(new HttpError("Invalid token", 401));
    req.username = (decoded as JwtPayload).username; // extract username from JWT
    next();
  });
};

import { NextFunction, Request, Response } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { verifyOptions } from "../controllers/jwt_options";

import { jwtSecret } from "../env";
import { HttpError } from "./error";

// Verify the token sent as a cookie
export const verifyToken = (req: Request, _: Response, next: NextFunction) => {
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
    req.username = (decoded as JwtPayload).username; // extract from JWT
    req.userId = (decoded as JwtPayload).userId; // extract from JWT
    next();
  });
};

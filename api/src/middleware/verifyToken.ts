import { NextFunction, Request, Response } from "express";
import { verify, VerifyOptions, Algorithm } from "jsonwebtoken";

import { jwtSecret } from "../env";
import { signOptions } from "../controllers/auth";

// JWT Verify options
const verifyOptions: VerifyOptions = {
  algorithms: [signOptions.algorithm] as Algorithm[],
  issuer: signOptions.issuer,
};

// Verify the token sent as a cookie
export const verifyToken = (
  req: Request,
  res: Response<{ err: string }>,
  next: NextFunction
) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw new Error("No Authorization header found");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new Error("Authorization token is not provided");
    }
    verify(token, jwtSecret, verifyOptions);
    next();
  } catch (err) {
    console.log(err);
    res.json({ err: "You are not aurothorized for this endpoint." });
  }
};

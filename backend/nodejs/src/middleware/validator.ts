import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { HttpError } from "../middleware/error";
import User from "../models/auth";

export const usernameIsUnique = body("username").custom(async (value) => {
  const user = await User.findOne({ username: value });
  if (user) throw new HttpError("username already in use", 400);
});

export const passwordIsStrong = body("password")
  .isLength({ min: 5 })
  .withMessage("must be at least 5 chars long")
  .matches(/\d/)
  .withMessage("must contain a number")
  .matches(/[a-z]/)
  .withMessage("must contain a lowercase char")
  .matches(/[A-Z]/)
  .withMessage("must contain an uppercase char");

export const handleValidationErrors = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array({ onlyFirstError: true })[0]?.msg;
    return next(new HttpError(msg, 400));
  }
  next();
};

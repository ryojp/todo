import { Router } from "express";
import { body } from "express-validator";

import { login, signup, refresh } from "../controllers/auth";
import { HttpError } from "../middleware/error";
import User from "../models/auth";

export const router = Router();

router.post(
  "/signup",
  body("username").custom(async (value) => {
    const user = await User.findOne({ username: value });
    if (user) throw new HttpError("username already in use", 400);
  }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("must be at least 5 chars long")
    .matches(/\d/)
    .withMessage("must contain a number")
    .matches(/[a-z]/)
    .withMessage("must contain a lowercase char")
    .matches(/[A-Z]/)
    .withMessage("must contain an uppercase char"),
  signup
);
router.post("/login", login);
router.post("/token", refresh);

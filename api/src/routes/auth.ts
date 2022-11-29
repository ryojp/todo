import { Router } from "express";
import { body } from "express-validator";

import { login, signup, refresh, updateUser } from "../controllers/auth";
import { HttpError } from "../middleware/error";
import { verifyToken } from "../middleware/verifyToken";
import User from "../models/auth";

export const router = Router();

const uniqueUsername = body("username").custom(async (value) => {
  const user = await User.findOne({ username: value });
  if (user) throw new HttpError("username already in use", 400);
});

const strongPassword = body("password")
  .isLength({ min: 5 })
  .withMessage("must be at least 5 chars long")
  .matches(/\d/)
  .withMessage("must contain a number")
  .matches(/[a-z]/)
  .withMessage("must contain a lowercase char")
  .matches(/[A-Z]/)
  .withMessage("must contain an uppercase char");

router.post("/signup", uniqueUsername, strongPassword, signup);
router.post("/login", login);
router.post("/token", refresh);
router.patch(
  "/user",
  verifyToken,
  uniqueUsername.optional(),
  strongPassword.optional(),
  updateUser
);

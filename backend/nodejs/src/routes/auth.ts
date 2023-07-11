import { Router } from "express";

import {
  login,
  signup,
  refresh,
  updateUser,
  deleteUser,
  getUser,
} from "../controllers/auth";
import {
  handleValidationErrors,
  passwordIsStrong,
  usernameIsUnique,
} from "../middleware/validator";
import { verifyToken } from "../middleware/verifyToken";

export const router = Router();

router.post(
  "/signup",
  usernameIsUnique,
  passwordIsStrong,
  handleValidationErrors,
  signup
);
router.post("/login", login);
router.post("/token", refresh);
router.get("/user", verifyToken, getUser);
router.patch(
  "/user",
  verifyToken,
  usernameIsUnique.optional(),
  passwordIsStrong.optional(),
  handleValidationErrors,
  updateUser
);
router.delete("/user", verifyToken, deleteUser);

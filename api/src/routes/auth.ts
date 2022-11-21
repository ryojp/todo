import { Router } from "express";

import { login, signup } from "../controllers/userController";

export const router = Router();

router.post("/signup", signup);
router.post("/login", login);

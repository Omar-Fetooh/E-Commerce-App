import { Router } from "express";
import {
  confirmEmail,
  login,
  registerUser,
  updateAccount,
} from "./users.controller.js";
import { errorHandler } from "../../Middlewares/error-handling.middleware.js";

export const userRouter = Router();

userRouter.post("/register", errorHandler(registerUser));

userRouter.get("/confirm-email/:token", errorHandler(confirmEmail));

userRouter.post("/login", errorHandler(login));

userRouter.patch("/update/:userId", errorHandler(updateAccount));

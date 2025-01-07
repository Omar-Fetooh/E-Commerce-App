import { Router } from "express";
import {
  confirmEmail,
  registerUser,
  updateAccount,
} from "./users.controller.js";
import { errorHandler } from "../../Middlewares/error-handling.middleware.js";

export const userRouter = Router();

userRouter.post("/register", errorHandler(registerUser));

userRouter.get("/confirm-email/:token", errorHandler(confirmEmail));

userRouter.patch("/update/:userId", errorHandler(updateAccount));

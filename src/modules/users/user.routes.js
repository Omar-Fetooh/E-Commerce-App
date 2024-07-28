import { Router } from "express"
import { refreshToken, signUp, verifyEmail } from "./user.controllers.js";

const userRouter = Router();
userRouter.post("/signUp", signUp)
userRouter.get("/verifyEmail/:token", verifyEmail)
userRouter.get("/refreshToken/:rfToken", refreshToken)

export default userRouter 
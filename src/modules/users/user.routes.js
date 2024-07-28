import { Router } from "express"
import {
    forgetPassword, refreshToken,
    resetPassword, signIn,
    signUp, verifyEmail
} from "./user.controllers.js";

const userRouter = Router();
userRouter.post("/signUp", signUp)
userRouter.post("/signIn", signIn)
userRouter.get("/verifyEmail/:token", verifyEmail)
userRouter.get("/refreshToken/:rfToken", refreshToken)
userRouter.patch("/sendCode", forgetPassword);
userRouter.patch("/resetPassword", resetPassword);


export default userRouter  
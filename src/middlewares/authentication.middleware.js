import jwt from "jsonwebtoken";

import { ErrorClass } from "../Utils/index.js";
import { User } from "../../DB/Models/user.model.js";

export const auth = () => {
  return async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
      return next(new ErrorClass("Token is required", 404));
    }

    if (!token.startsWith(process.env.TOKEN_PREFIX)) {
      return next(new ErrorClass("Invalid token", 400));
    }

    const originalToken = token.split(" ")[1];

    const data = jwt.verify(originalToken, process.env.LOGIN_SECRET);
    if (!data?.userId) {
      return next(new ErrorClass("Invalid Token Payload", 400));
    }

    const isUserExists = await User.findById(data.userId);
    if (!isUserExists) {
      return next(new ErrorClass("User not found", 404));
    }

    req.authUser = isUserExists;
    next();
  };
};

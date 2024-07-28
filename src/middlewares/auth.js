import jwt from "jsonwebtoken"
import { AppError, catchAsyncHandler } from "../utils/error.js";
import User from "../../database/models/user.model.js";

export const auth = (roles) => {
    return catchAsyncHandler(async (req, res, next) => {
        try {
            // Authentication
            const { token } = req.headers;
            if (!token) {
                throw new AppError("token is not exists", 400)
            }

            if (!token.startWith("omar__")) {
                throw new AppError("invalid bearer token", 400)
            }

            const newToken = token.split("omar__")[1]
            if (!newToken) {
                throw new AppError("invalid token")
            }

            const decoded = jwt.verify(newToken, "secret")
            if (!decoded?.email) {
                throw new AppError("invalid token payload ", 400)
            }

            const user = await User.findOne({ email: decoded.email })
            if (!user) throw new AppError("user is nto exists", 409)

            // Authorization
            if (!roles.includes(user.role)) throw new AppError("you don't have permission", 401)

            if (parseInt(user.passwordChangeAt.getTime() / 1000) > decoded.iat) {
                return res.status(403).json({ msg: "Token expired please login again" })
            }
            req.user = user;
            next()
        }
        catch (error) {
            throw new AppError("catch error in auth", 400)
        }
    })
}
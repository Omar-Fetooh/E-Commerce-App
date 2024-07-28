import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

import { AppError, catchAsyncHandler } from "../../utils/error.js";
import userModel from "../../../database/models/user.model.js"
import { sendEmail } from "../../service/sendEmail.js";


// =====================================signUp============================================
export const signUp = catchAsyncHandler(async (req, res, next) => {
    const { name, email, password, age, cPassword, phone, address } = req.body;

    const userExists = await userModel.findOne({ email: email.toLowerCase(), });
    if (userExists) next(new AppError("user Already exists", 409))

    if (cPassword !== password) next(new AppError("Passwords do not match", 400))

    const token = jwt.sign({ email }, process.env.signatureKey, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`

    const rfToken = jwt.sign({ email }, signatureKeyRefresh)
    const rfLink = `${req.protocol}://${req.headers.host}/users/refreshToken/${rfToken}`

    await sendEmail(email, "verify your email", `<a href="${link}"> Click Here </a><br>
        <a href="${rfLink}">click here to resend the link</a> `)

    const hash = bcrypt.hashSync(password, Number(process.env.saltRounds));

    const user = new userModel({ name, email, password: hash, age, phone, address })  // intermedate object to manipulate with
    const newUser = await user.save()

    newUser ?
        res.status(201).json({ msg: "done", user: newUser }) :
        next(new AppError("user not created", 500))
})

// =====================================verifyEmail============================================
export const verifyEmail = catchAsyncHandler(async (req, res, next) => {
    const { token } = req.params

    const decoded = jwt.verify(token, process.env.signatureKey)
    if (!decoded?.email) return next(new AppError("invalid token", 400))

    const user = await userModel.findOneAndUpdate({ email: decoded.email, confirmed: false }, { confirmed: true })
    user ?
        res.status(200).json({ msg: "done" }) :
        next(new AppError("user not exists or already confirmed", 400))
})

// =====================================refreshToken============================================
export const refreshToken = catchAsyncHandler(async (req, res, next) => {
    const { rfToken } = req.params

    const decoded = jwt.verify(rfToken, process.env.signatureKeyRefresh)
    if (!decoded?.email) return next(new AppError("invalid token", 400))

    const user = await userModel.findOne({ email: decoded.email, confirmed: true })
    if (user) return next(new AppError("user already confirmed", 400))

    const token = jwt.sign({ email: decoded.email }, process.env.signatureKey, { expiresIn: 60 * 2 })
    const link = `${req.protocol}://${req.headers.host}/users/verifyEmail/${token}`

    await sendEmail(decoded.email, "verify your email", `<a href="${link}"> Click Here </a>`)

    res.status(200).json({ msg: "done" })
})


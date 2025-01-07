import { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";
import { sendEmailService } from "../../Services/send-email.service.js";

export const registerUser = async (req, res, next) => {
  const { userName, email, password, gender, age, phone, userType } = req.body;

  // Check if email exists
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    return next(new ErrorClass("Email already Exists", 400));
  }

  // hash password
  //   const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
  // appllied in the hook

  const userObj = new User({
    userName,
    email,
    password,
    gender,
    age,
    phone,
    userType,
  });

  // sendEmail Verification

  const token = jwt.sign({ _id: userObj._id }, process.env.SECRET_APPKEY, {
    expiresIn: "3h",
  });

  const confirmationEmail = `${req.protocol}://${req.headers.host}/users/confirm-email/${token}`;

  const isEmailSent = await sendEmailService({
    to: email,
    subject: "Welcome to our App",
    htmlMessage: `<a href=${confirmationEmail}>Click here to cofirm your email</a>`,
  });

  if (isEmailSent.rejected.length) {
    throw new ErrorClass("Email not sent", 400);
  }

  const newUser = await userObj.save();

  res.status(201).json({
    status: "Success",
    message: "User Created Successfully",
    data: newUser,
  });
};

export const confirmEmail = async (req, res) => {
  const { token } = req.params;
  const { _id } = jwt.verify(token, process.env.SECRET_APPKEY);

  const user = await User.findOneAndUpdate(
    { _id, isEmailVerified: false },
    { isEmailVerified: true },
    { new: true }
  );

  if (!user) {
    throw new ErrorClass("User not Found", 400);
  }
  res.status(200).json({ message: "Email Confirmed" });
};

export const updateAccount = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
  if (!user) {
    next(new ErrorClass("User not exists", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Account Updated successfully",
    data: user,
  });
};

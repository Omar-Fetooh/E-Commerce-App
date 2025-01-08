import { hashSync } from "bcrypt";
import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

export const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "name is required"],
      minLength: 3,
      maxLength: 15,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      trim: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["Buyer", "Admin"],
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    phone: [String],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMarkedAsDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.password = hashSync(this.password, +process.env.SALT_ROUNDS);
  next();
});

userSchema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = hashSync(
      this._update.password,
      +process.env.SALT_ROUNDS
    );
});

export const User = mongoose.models.User || model("User", userSchema);

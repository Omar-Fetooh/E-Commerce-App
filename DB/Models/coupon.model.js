import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;
import { CouponType } from "../../src/Utils/index.js";

const couponSchema = new Schema(
  {
    couponCode: {
      type: String,
      required: true,
      unique: true,
    },
    couponAmount: {
      type: Number,
      required: true,
    },
    couponType: {
      type: String,
      required: true,
      enum: Object.values(CouponType),
    },
    from: {
      type: Date,
      required: true,
    },
    till: {
      type: Date,
      required: true,
    },
    Users: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        maxCount: { type: Number, min: 1, required: true },
        usageCount: { type: Number, default: 0 },
      },
    ],
    isEnable: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = mongoose.models.Coupon || model("Coupon", couponSchema);

import { OrderStatus, PaymentMethods } from "../../src/Utils/index.js";
import mongoose from "../global-setup.js";

const { Schema, model } = mongoose;

export const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    fromCart: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
    addressId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    VAT: {
      type: Number,
      required: true,
    },
    couponId: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethods),
      required: true,
    },
    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      required: true,
    },
    estimatedDeliveryDate: {
      type: Date,
      required: true,
    },
    deliveredBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    canceledBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    deliverdAt: Date,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || model("Order", orderSchema);

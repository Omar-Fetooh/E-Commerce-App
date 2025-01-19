import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";

import {
  createCoupon,
  disableEnableCoupon,
  getCouponById,
  getCoupons,
  updateCoupon,
} from "./coupon.controller.js";
import { CreateCouponSchema, updateCouponSchema } from "./coupon.schema.js";

const { auth, errorHandler, validationMiddleware } = middlewares;

export const couponRouter = Router();

couponRouter.post(
  "/create",
  auth(),
  validationMiddleware(CreateCouponSchema),
  errorHandler(createCoupon)
);

couponRouter.get("/", errorHandler(getCoupons));
couponRouter.get("/details/:couponId", errorHandler(getCouponById));

couponRouter.put(
  "/update/:couponId",
  auth(),
  validationMiddleware(updateCouponSchema),
  errorHandler(updateCoupon)
);

couponRouter.patch(
  "/enable/:couponId",
  auth(),
  errorHandler(disableEnableCoupon)
);

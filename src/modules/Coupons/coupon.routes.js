import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";

import { createCoupon } from "./coupon.controller.js";
import { CreateCouponSchema } from "./coupon.schema.js";

const { auth, errorHandler, validationMiddleware } = middlewares;

export const couponRouter = Router();

couponRouter.post(
  "/create",
  auth(),
  validationMiddleware(CreateCouponSchema),
  errorHandler(createCoupon)
);

import { Coupon } from "../../../DB/Models/index.js";
import { Validation } from "../Middlewares/validation.middleware.js";
import { couponValidationSchema } from "../Validators/create-coupon.validator.js";

export const createCouponResolver = async (parent, args) => {
  const { couponCode, couponAmount, couponType, from, till } = args;

  const isArgsValid = await Validation(couponValidationSchema, args);
  if (isArgsValid !== true) return new Error(isArgsValid);
  const coupon = await Coupon.create({
    couponCode,
    couponAmount,
    couponType,
    from,
    till,
  });

  return coupon;
};

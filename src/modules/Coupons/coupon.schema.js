import Joi from "joi";
import { CouponType, generalRules } from "../../Utils/index.js";

export const CreateCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().required(),
    couponType: Joi.string()
      .valid(...Object.values(CouponType))
      .required(),
    from: Joi.date().greater(Date.now()).required(),
    till: Joi.date().greater(Joi.ref("from")).required(),
    Users: Joi.array().items(
      Joi.object({
        userId: generalRules._id.required(),
        maxCount: Joi.number().min(1).required(),
      })
    ),
    couponAmount: Joi.number()
      .required()
      .when("couponType", {
        is: Joi.string().valid(CouponType.PERCENTAGE),
        then: Joi.number().min(1).max(100).required(),
      })
      .min(1)
      .messages({
        "number.min": "Coupon amount must be greater than 0",
        "number.max": "Coupon amount must be less than 100",
      }),
  }),
};

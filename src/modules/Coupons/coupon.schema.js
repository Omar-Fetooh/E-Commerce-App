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

export const updateCouponSchema = {
  body: Joi.object({
    couponCode: Joi.string().optional(),
    couponType: Joi.string()
      .valid(...Object.values(CouponType))
      .optional(),
    from: Joi.date().greater(Date.now()).optional(),
    till: Joi.date().greater(Joi.ref("from")).optional(),
    Users: Joi.array().items(
      Joi.object({
        userId: generalRules._id.optional(),
        maxCount: Joi.number().min(1).optional(),
      })
    ),
    couponAmount: Joi.number()
      .optional()
      .when("couponType", {
        is: Joi.string().valid(CouponType.PERCENTAGE),
        then: Joi.number().min(1).max(100).optional(),
      })
      .min(1)
      .messages({
        "number.min": "Coupon amount must be greater than 0",
        "number.max": "Coupon amount must be less than 100",
      }),
  }),

  params: Joi.object({
    couponId: generalRules._id.required(),
  }),

  authUser: Joi.object({
    _id: generalRules._id.required(),
  }).options({ allowUnknown: true }),
};

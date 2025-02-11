import Joi from "joi";

export const couponValidationSchema = Joi.object({
  _id: Joi.string().optional(),
  couponCode: Joi.string().trim().min(3).max(50).required(),
  couponAmount: Joi.number().positive().required(),
  couponType: Joi.string().valid("Percentage", "Fixed").required(),
  from: Joi.date().required(),
  till: Joi.date().greater(Joi.ref("from")).required(),
  isEnable: Joi.boolean().required(),
  createdBy: Joi.string().required(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

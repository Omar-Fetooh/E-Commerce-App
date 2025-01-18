import Joi from "joi";
import mongoose from "mongoose";

const ojbectIdValidation = (value, helper) => {
  const isValid = mongoose.isValidObjectId(value);

  if (!isValid) return helper.message("Invalid object id");

  return value;
};

export const generalRules = {
  _id: Joi.string().custom(ojbectIdValidation),
};

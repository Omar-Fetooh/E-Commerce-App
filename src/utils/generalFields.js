import Joi from "joi";
import mongoose from "mongoose";

const objectIdValidation = (value, helper) => {
    return mongoose.Types.ObjectId.isValid(value) ? true : helper.message("invalid id")
}

export const generalFields = {
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30).required(),
    rePassword: Joi.string().valid(Joi.ref('password')).required(),
    file: Joi.object({
        size: Joi.number().positive().required(),
        path: Joi.string().required(),
        filename: Joi.string().required(),
        destination: Joi.string().required(),
        mimetype: Joi.string().required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        fieldname: Joi.string().required()
    }),

    headers: Joi.object({
        'cache-control': Joi.string(),
        'postman-token': Joi.string(),
        'content-type': Joi.string(),
        'content-length': Joi.string(),
        host: Joi.string(),
        'user-agent': Joi.string(),
        accept: Joi.string(),
        'accept-encoding': Joi.string(),
        connection: Joi.string(),
        token: Joi.string().required()
    }),
    id: Joi.string().custom(objectIdValidation)
}
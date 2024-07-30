import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js"
export const createBrandSchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required(),
    }).required(),
    file: generalFields.file.required(),
    headers: generalFields.headers.required()
}

export const createCouponSchmea = {
    body: Joi.object({
        code: Joi.string().min(3).max(30).required(),
        amount: Joi.number().min(1).max(100).integer().required(),
        fromDate: Joi.date().greater(Date.now()).required(),
        toDate: Joi.date().greater(Joi.ref('fromDate')).required()
    }),
    headers: generalFields.headers.required()
}
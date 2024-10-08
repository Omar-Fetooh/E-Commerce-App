import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js"
export const createCartSchema = {
    body: Joi.object({
        productId: generalFields.id.required(),
        quantity: Joi.number().integer().required()
    }).required(),
    headers: generalFields.headers.required()
}

export const deleteFromCartSchema = {
    body: Joi.object({
        productId: generalFields.id.required(),
    }).required(),
    headers: generalFields.headers.required()
}

export const clearCartSchema = {
    headers: generalFields.headers.required()
}

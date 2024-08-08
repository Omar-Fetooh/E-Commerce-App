import Joi from "joi"
import { generalFields } from "../../utils/generalFields.js"

export const createWishListSchema = {
    params: Joi.object({
        productId: generalFields.id.required()
    }).required(),
    headers: generalFields.headers.required()
}

export const removeWishListSchema = {
    params: Joi.object({
        productId: generalFields.id.required()
    }).required(),
    headers: generalFields.headers.required()
}



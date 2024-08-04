import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js"


export const createOrderSchmea = {
    body: Joi.object({
        productId: generalFields.id,
        quantity: Joi.number().integer(),
        couponCode: Joi.string().min(3).max(30),
        address: Joi.string().required(),
        phone: Joi.string().required(),
        paymentMethod: Joi.string().valid("cash", "card").required()
    }),
    headers: generalFields.headers.required()
}


import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js"


export const createReviewSchema = {
    body: Joi.object({
        rate: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().required()
    }).required(),
    params: Joi.object({
        productId: generalFields.id.required(),
    }),
    headers: generalFields.headers.required()
}

export const deleteReviewSchema = {
    params: Joi.object({
        productId: generalFields.id.required(),
        reviewId: generalFields.id.required()
    }),
    headers: generalFields.headers.required()
}



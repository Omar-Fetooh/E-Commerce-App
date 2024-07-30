import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js"


export const createProductSchema = {
    body: Joi.object({
        title: Joi.string().min(3).max(30).required(),
        description: Joi.string().min(3),
        category: generalFields.id.required(),
        subCategory: generalFields.id.required(),
        brand: generalFields.id.required(),
        price: Joi.number().min(1).required(),
        discount: Joi.number().min(1).max(100),
        stock: Joi.number().min(1).integer().required()
    }).required(),

    files: Joi.object({
        image: Joi.array().items(generalFields.file).required(),
        coverImages: Joi.array().items(generalFields.file).required()
    }),
    headers: generalFields.headers.required(),

}

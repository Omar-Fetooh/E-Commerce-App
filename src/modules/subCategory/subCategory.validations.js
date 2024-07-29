import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js"
export const createSubCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required(),
    }).required(),
    file: generalFields.file.required(),
    headers: generalFields.headers.required(),
    params: Joi.object({
        categoryId: generalFields.id.required()
    })
}

export const updateSubCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(30),
        category: generalFields.id
    }),
    file: generalFields.file,
    headers: generalFields.headers.required()
}

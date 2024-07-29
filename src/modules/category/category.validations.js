import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js"
export const createCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required()
    }).required(),
    file: generalFields.file.required(),
    headers: generalFields.headers.required()
}
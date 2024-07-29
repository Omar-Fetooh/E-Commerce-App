import Joi from "joi";
import { generalFields } from "../../utils/generalFields.js"
export const createSubCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(30).required(),
        category: generalFields.id.required()
    }).required(),
    file: generalFields.file.required(),
    headers: generalFields.headers.required()
}

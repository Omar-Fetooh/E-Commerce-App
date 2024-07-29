import categoryModel from "../../../database/models/category.model.js"

import { AppError, catchAsyncHandler } from "../../utils/error.js";

import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloudinary.js"
import slugify from "slugify";
// =================================  createCategory  ==================================================
export const createCategory = catchAsyncHandler(async (req, res, next) => {
    const { name } = req.body;

    const categoryExist = await categoryModel.findOne({ name: name.toLowerCase() });
    if (categoryExist)
        return next(new AppError("category already exists", 409))

    if (!req.file)
        return next(new AppError("image is required", 404))

    const customId = nanoid(5);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Ecommerce/categories/${customId}`
    })

    const category = await categoryModel.create({
        name,
        slug: slugify(name, {
            replacement: '_',
            lower: true
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        customId
    })

    res.status(201).json({ msg: "category Added Successfully", category })
})
import categoryModel from "../../../database/models/category.model.js"
import subCategoryModel from "../../../database/models/subCategory.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";
import cloudinary from "../../utils/cloudinary.js"

import { nanoid } from "nanoid";
import slugify from "slugify";

// =================================  createSubCategory  ==================================================
export const createSubCategory = catchAsyncHandler(async (req, res, next) => {
    const { name, category } = req.body;

    const categoryExist = await categoryModel.findById(category);
    if (!categoryExist)
        return next(new AppError("category does not exist", 404))

    const subCategoryExist = await subCategoryModel.findOne({ name: category.toLowerCase() });
    if (subCategoryExist)
        return next(new AppError("subCategory already exists", 409))

    if (!req.file)
        return next(new AppError("image is required", 404))

    const customId = nanoid(5);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${customId}`
    })

    const subCategory = await subCategoryModel.create({
        name,
        slug: slugify(name, {
            replacement: '_',
            lower: true
        }),
        category,
        image: { secure_url, public_id },
        createdBy: req.user._id,
        customId
    })

    res.status(201).json({ msg: "subCategory Added Successfully", subCategory })
})


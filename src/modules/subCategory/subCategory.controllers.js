import categoryModel from "../../../database/models/category.model.js"
import subCategoryModel from "../../../database/models/subCategory.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";
import cloudinary from "../../utils/cloudinary.js"

import { nanoid } from "nanoid";
import slugify from "slugify";

// =================================  createSubCategory  ==================================================
export const createSubCategory = catchAsyncHandler(async (req, res, next) => {
    const { name } = req.body;

    const categoryExist = await categoryModel.findById(req.params.categoryId);
    if (!categoryExist)
        return next(new AppError("category does not exist", 404))

    const subCategoryExist = await subCategoryModel.findOne({ name: name.toLowerCase() });
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
        category: req.params.categoryId,
        image: { secure_url, public_id },
        createdBy: req.user._id,
        customId
    })

    res.status(201).json({ msg: "subCategory Added Successfully", subCategory })
})

// =================================  updateSubCategory  ==================================================
export const updateSubCategory = catchAsyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;

    const subCategory = await subCategoryModel.findOne({ _id: id, createdBy: req.user._id });
    if (!subCategory)
        return next(new AppError("subCategory does not  exist", 404))

    if (name) {
        if (name.toLowerCase() === subCategory.name) {
            return next(new AppError("name must be different from previous name ", 400))
        }
        if (await subCategoryModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("name already exist ", 409))
        }

        subCategory.name = name.toLowerCase();
        subCategory.slug = slugify(name, {
            replacement: "_",
            lower: true
        })
    }
    const category = await categoryModel.findOne({ _id: subCategory.category })

    if (req.file) {
        await cloudinary.uploader.destroy(subCategory.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/categories/${category.customId}/subCategories/${subCategory.customId}`
        })
        subCategory.image = { secure_url, public_id }
    }

    await subCategory.save()

    res.status(201).json({ msg: "SubCategory updated Successfully", subCategory })

})

// =================================  getSubCategories ==================================================
export const getSubCategories = catchAsyncHandler(async (req, res, next) => {

    const subCategories = await subCategoryModel.find().populate([
        {
            path: "category",
            select: "-_id"
        },
        {
            path: "createdBy",
            select: "-_id"
        }
    ])

    res.status(201).json({ msg: "done", subCategories })
})
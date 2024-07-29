import categoryModel from "../../../database/models/category.model.js"

import { AppError, catchAsyncHandler } from "../../utils/error.js";

import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloudinary.js"
import slugify from "slugify";
import subCategoryModel from "../../../database/models/subCategory.model.js";
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

// =================================  updateCategory  ==================================================
export const updateCategory = catchAsyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findOne({ _id: id, createdBy: req.user._id });
    if (!category)
        return next(new AppError("category does not  exist", 404))

    if (name) {
        if (name.toLowerCase() === category.name) {
            return next(new AppError("name must be different from previous name ", 400))
        }
        if (await categoryModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("name already exist ", 409))
        }

        category.name = name.toLowerCase();
        category.slug = slugify(name, {
            replacement: "_",
            lower: true
        })
    }
    if (req.file) {
        await cloudinary.uploader.destroy(category.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/categories/${category.customId}`
        })
        category.image = { secure_url, public_id }
    }

    await category.save()

    res.status(201).json({ msg: "category updated Successfully", category })

})

// =================================  getCategories ==================================================
export const getCategories = catchAsyncHandler(async (req, res, next) => {

    const categories = await categoryModel.find().populate({
        path: "subCategories"
    })

    res.status(200).json({ msg: "done", categories })

})

// =================================  deleteCategory ==================================================
export const deleteCategory = catchAsyncHandler(async (req, res, next) => {
    const { id } = req.params
    const category = await categoryModel.findOneAndDelete({
        _id: id,
        createdBy: req.user._id
    })

    if (!category) return next(new AppError("category does not exist or you don't have permission", 401))

    await subCategoryModel.deleteMany({ category: category._id })

    await cloudinary.api.delete_resources_by_prefix(`Ecommerce/categories/${category.customId}`)
    await cloudinary.api.delete_folder(`Ecommerce/categories/${category.customId}`)

    res.status(200).json({ msg: "done" })
})
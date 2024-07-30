import { nanoid } from "nanoid";
import slugify from "slugify";

import subCategoryModel from "../../../database/models/subCategory.model.js";
import brandModel from "../../../database/models/brand.model.js"
import categoryModel from "../../../database/models/category.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";
import cloudinary from "../../utils/cloudinary.js"
import productModel from "../../../database/models/product.model.js";

// =================================  createProduct  ==================================================
export const createProduct = catchAsyncHandler(async (req, res, next) => {
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body;

    const categoryExist = await categoryModel.findById(category);
    if (!categoryExist)
        return next(new AppError("category does not exist", 404))

    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
    if (!subCategoryExist)
        return next(new AppError("subCategory does not exist", 404))

    const brandExist = await brandModel.findById(brand);
    if (!brandExist)
        return next(new AppError("brand does not exist", 404))

    const productExist = await productModel.findOne({ title: title.toLowerCase() });
    if (productExist)
        return next(new AppError("product already  exists", 409))

    const subPrice = price * ((100 - discount) / 100)

    if (!req.files)
        return next(new AppError("image is required", 404))

    const customId = nanoid(5);

    let list = []
    for (const file of req.files.coverImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}/coverImages`
        })
        list.push({ secure_url, public_id })
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}`
    })

    const product = await productModel.create({
        title,
        slug: slugify(title, {
            replacement: "_",
            lower: true
        }),
        description,
        category,
        subCategory,
        brand,
        price,
        discount,
        stock,
        createdBy: req.user._id,
        customId,
        subPrice,
        image: { secure_url, public_id },
        coverImages: list
    })
    res.status(201).json({ msg: "product Added Successfully", product })
})

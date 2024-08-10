import { nanoid } from "nanoid";
import slugify from "slugify";

import subCategoryModel from "../../../database/models/subCategory.model.js";
import brandModel from "../../../database/models/brand.model.js"
import categoryModel from "../../../database/models/category.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";
import cloudinary from "../../utils/cloudinary.js"
import productModel from "../../../database/models/product.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

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

// =================================  updateProduct  ==================================================
export const updateProduct = catchAsyncHandler(async (req, res, next) => {
    const { title, description, category, subCategory, brand, price, discount, stock } = req.body;
    const { productId } = req.params;

    const categoryExist = await categoryModel.findById(category);
    if (!categoryExist)
        return next(new AppError("category does not exist", 404))

    const subCategoryExist = await subCategoryModel.findOne({ _id: subCategory, category });
    if (!subCategoryExist)
        return next(new AppError("subCategory does not exist", 404))

    const brandExist = await brandModel.findById(brand);
    if (!brandExist)
        return next(new AppError("brand does not exist", 404))

    const product = await productModel.findOne({ _id: productId, createdBy: req.user._id });

    if (!product)
        return next(new AppError("product not exist", 404))

    if (title) {
        if (product.title == title.toLowerCase()) {
            return next(new AppError("Sorry title matches the old title", 409))
        }
        if (await productModel.findOne({ title: title.toLowerCase() }) === title.toLowerCase()) {
            return next(new AppError("Sorry title exist before", 409))
        }

        product.slug = slugify(title, {
            lower: true,
            replacement: "_"
        })
    }

    if (description) product.description = description;
    if (stock) product.stock = stock;

    if (price && discount) {
        product.subPrice = price * ((100 - discount) / 100)
        product.price = price
        product.discount = discount
    }
    else if (price) {
        product.subPrice = price * ((100 - product.discount) / 100)
        product.price = price
    }
    else if (discount) {
        product.subPrice = product.price * ((100 - discount) / 100)
        product.discount = discount
    }

    if (req.files) {
        if (req.files?.image?.length) {
            await cloudinary.uploader.destroy(product.image.public_id)
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.image[0].path, {
                folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${customId}`
            })
            product.image = { secure_url, public_id }
        }
        if (req.files?.coverImages?.length) {
            await cloudinary.api.delete_resources_by_prefix(`Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/coverImages`)
            let list = []
            for (const file of req.files.coverImages) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `Ecommerce/categories/${categoryExist.customId}/subCategories/${subCategoryExist.customId}/products/${product.customId}/coverImages`
                })
                list.push({ secure_url, public_id })
            }
            product.coverImages = list
        }
    }

    await product.save();

    res.status(201).json({ msg: "product updated Successfully", product })
})

// =================================  getProducts  ==================================================
export const getProducts = catchAsyncHandler(async (req, res, next) => {

    const apiFeature = new ApiFeatures(productModel.find(), req.query)
        .pagination()
        .filter()
        .search()
        .sort()
        .select()

    const products = await apiFeature.mongooseQuery

    res.status(200).json({ msg: "done", page: apiFeature.page, products })
})
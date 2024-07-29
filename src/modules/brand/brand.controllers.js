import brandModel from "../../../database/models/brand.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";

import { nanoid } from "nanoid";
import cloudinary from "../../utils/cloudinary.js"
import slugify from "slugify";
// =================================  createBrand  ==================================================
export const createBrand = catchAsyncHandler(async (req, res, next) => {
    const { name } = req.body;

    const brandExist = await brandModel.findOne({ name: name.toLowerCase() });
    if (brandExist)
        return next(new AppError("brand already exists", 409))

    if (!req.file)
        return next(new AppError("image is required", 404))

    const customId = nanoid(5);
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `Ecommerce/brands/${customId}`
    })

    const brand = await brandModel.create({
        name,
        slug: slugify(name, {
            replacement: '_',
            lower: true
        }),
        image: { secure_url, public_id },
        createdBy: req.user._id,
        customId
    })

    res.status(201).json({ msg: "category Added Successfully", brand })
})
// =================================  updateBrand  ==================================================
export const updateBrand = catchAsyncHandler(async (req, res, next) => {
    const { name } = req.body;
    const { id } = req.params;

    const brand = await brandModel.findOne({ _id: id, createdBy: req.user._id });
    if (!brand)
        return next(new AppError("brand does not  exist", 404))

    if (name) {
        if (name.toLowerCase() === brand.name) {
            return next(new AppError("name must be different from previous name ", 400))
        }
        if (await brandModel.findOne({ name: name.toLowerCase() })) {
            return next(new AppError("name already exist ", 409))
        }

        brand.name = name.toLowerCase();
        brand.slug = slugify(name, {
            replacement: "_",
            lower: true
        })
    }

    if (req.file) {
        await cloudinary.uploader.destroy(brand.image.public_id)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `Ecommerce/brands/${brand.customId}/`
        })
        brand.image = { secure_url, public_id }
    }

    await brand.save()

    res.status(201).json({ msg: "brand updated Successfully", brand })

})
import wishListModel from "../../../database/models/wishList.model.js";
import productModel from "../../../database/models/product.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";

// =================================  createWishList  ==================================================
export const createWishList = catchAsyncHandler(async (req, res, next) => {
    const { productId } = req.params;

    const product = await productModel.findById(productId)
    if (!product) {
        return next(new AppError("product not exist", 404));
    }

    const wishListExist = await wishListModel.findOne({ user: req.user._id })

    if (!wishListExist) {
        const wishList = await wishListModel.create({
            user: req.user._id,
            products: [productId]
        })
        return res.status(201).json({ msg: "done", wishList })
    }

    const newWishList = await wishListModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $addToSet: { products: productId }
        },
        {
            new: true
        }
    )

    res.status(201).json({ msg: "done", newWishList })
})

// =================================  removeWishList  ==================================================
export const removeWishList = catchAsyncHandler(async (req, res, next) => {
    const { productId } = req.params;

    const product = await productModel.findById(productId)
    if (!product) {
        return next(new AppError("product not exist", 404));
    }
    const wishListExist = await wishListModel.findOne({ user: req.user._id })

    if (!wishListExist) {
        return next(new AppError("no wishList exists"), 404)
    }

    const newWishList = await wishListModel.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { products: productId }
        },
        {
            new: true
        }
    )

    res.status(200).json({ msg: "done", newWishList })
})
import cartModel from "../../../database/models/cart.model.js";
import productModel from "../../../database/models/product.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";

// =================================  createCart  ==================================================
export const createCart = catchAsyncHandler(async (req, res, next) => {
    const { productId, quantity } = req.body;

    const product = await productModel.findOne({ _id: productId, stock: { $gte: quantity } })
    if (!product)
        return next(new AppError("Product does not exist or out of stock"))

    const cartExist = await cartModel.findOne({ user: req.user._id });
    if (!cartExist) {
        const cart = await cartModel.create({
            user: req.user._id,
            products: [{
                productId,
                quantity
            }]
        });
        return res.status(201).json({ message: "Cart Added Successfully", cart })
    }

    let flag = false;

    for (const product of cartExist.products) {
        if (product.productId == productId) {
            product.quantity += quantity
            flag = true
        }
    }

    if (!flag) {
        cartExist.products.push({
            productId,
            quantity
        })
    }
    await cartExist.save()

    res.status(200).json({ msg: "done", cart: cartExist })
})

// =================================  deleteFromCart  ==================================================
export const deleteFromCart = catchAsyncHandler(async (req, res, next) => {
    const { productId } = req.body;

    const cartExist = await cartModel.findOneAndUpdate(
        {
            user: req.user.id,
            "products.productId": productId
        },
        {
            $pull: { products: { productId } }
        },
        {
            new: true
        }
    )

    res.status(200).json({ msg: "done", cart: cartExist })
})

// =================================  clearCart  ==================================================
export const clearCart = catchAsyncHandler(async (req, res, next) => {

    const cartExist = await cartModel.findOneAndUpdate(
        {
            user: req.user.id,
        },
        {
            products: []
        },
        {
            new: true
        }
    )

    res.status(200).json({ msg: "done", cart: cartExist })
})


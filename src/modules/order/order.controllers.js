import orderModel from "../../../database/models/order.model.js";
import couponModel from "../../../database/models/coupon.model.js";
import cartModel from "../../../database/models/cart.model.js";
import productModel from "../../../database/models/product.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";

// =================================  createOrder  ==================================================
export const createOrder = catchAsyncHandler(async (req, res, next) => {
    const { productId, quantity, couponCode, address, phone, paymentMethod } = req.body;

    if (couponCode) {
        const coupon = await couponModel.findOne({
            code: couponCode,
            usedBy: { $nin: [req.user._id] }
        })

        if (!coupon || coupon.toDate < Date.now()) {
            return next(new AppError("coupon not valid , used before or expired"), 409)
        }
        req.body.coupon = coupon
    }

    let flag = false;
    let products = []
    if (productId) {
        products = [{ productId, quantity }]
    }
    else {
        const cart = await cartModel.findOne({
            user: req.user._id
        })
        if (!cart) {
            return next(new AppError("cart is empty, please add products"), 404)
        }
        flag = true
        products = cart.products
    }

    const finalProducts = []
    let subPrice = 0;
    for (let product of products) {
        const checkProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity }
        })
        if (!checkProduct) {
            return next(new AppError("product not exists or out of stock "), 404)
        }
        if (flag) {
            product = product.toObject();
        }

        product.title = checkProduct.title
        product.price = checkProduct.price
        product.finalPrice = checkProduct.subPrice * product.quantity
        subPrice += product.finalPrice

        finalProducts.push(product)
    }


    const order = await orderModel.create({
        user: req.user._id,
        products: finalProducts,
        subPrice,
        couponId: req.body.coupon?._id,
        totalPrice: subPrice - subPrice * ((req.body.coupon?.amount) || 0) / 100,
        address,
        phone,
        paymentMethod,
        status: paymentMethod == "card" ? "placed" : "waitPayment",
    })
    res.status(201).json({ msg: "order Added Successfully", order })
})

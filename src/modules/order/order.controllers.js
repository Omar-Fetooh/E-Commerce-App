import orderModel from "../../../database/models/order.model.js";
import couponModel from "../../../database/models/coupon.model.js";
import cartModel from "../../../database/models/cart.model.js";
import productModel from "../../../database/models/product.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";
import { createInvoice } from "../../utils/pdf.js";
import { sendEmail } from "../../service/sendEmail.js";

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

    // to push the user in coupon model to not let the user use the same coupon again 
    if (req.body?.coupon) {
        await couponModel.updateOne({ _id: req.body.coupon._id },
            {
                $push: { usedBy: req.user._id }
            })
    }

    // decrement the product's stock by order's quantity 
    for (const product of finalProducts) {
        await productModel.findByIdAndUpdate({ _id: product.productId }, {
            $inc: { stock: -product.quantity }
        })
    }

    // make the cart empty if user ordered through it 
    if (flag) {
        await cartModel.updateOne(
            { user: req.user._id },
            {
                products: []
            }
        )
    }

    const invoice = {
        shipping: {
            name: req.user.name,
            address: req.user.address,
            city: "Cairo",
            state: "Cairo",
            country: "Egypt",
            postal_code: 94111
        },
        items: order.products,
        subtotal: order.subPrice,
        paid: order.totalPrice,
        invoice_nr: order._id,
        date: order.createdAt,
        coupon: req.body?.coupon?.amount || 0
    };

    await createInvoice(invoice, "invoice.pdf");

    await sendEmail(req.user.email, "Order Placed", `Your Order has been placed Successfully`, [
        {
            path: "invoice.pdf",
            contentType: "application/pdf"
        },
        {
            path: "noon.png",
            contentType: "image/png "
        },
    ])
    res.status(201).json({ msg: "order Added Successfully", order })
})

// =================================  cancelOrder  ==================================================

export const cancelOrder = catchAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await orderModel.findOne({ _id: id, user: req.user._id });
    if (!order) {
        return next(new AppError("order not found", 404))
    }

    if ((order.paymentMethod == "cash" && order.status !== "placed") || (order.paymentMethod == "card" && order.status !== "waitPayment")) {
        console.log(order.paymentMethod);
        console.log(order.status);

        return next(new AppError("order can not be canceled", 400))
    }

    await orderModel.updateOne({ _id: id },
        {
            status: "cancelled",
            reason,
            cancelledBy: req.user._id
        }
    )

    if (order?.couponId) {
        await couponModel.updateOne({ _id: order?.couponId },
            {
                $pull: { usedBy: req.user._id }
            }
        )
    }

    for (const product of order.products) {
        await productModel.updateOne({ _id: product.productId }, {
            $inc: { stock: product.quantity }
        })
    }
    res.status(200).json({ msg: "product cancelled successfully" })
})
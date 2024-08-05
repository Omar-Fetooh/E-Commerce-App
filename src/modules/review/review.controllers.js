import reviewModel from "../../../database/models/review.model.js";
import productModel from "../../../database/models/product.model.js";
import orderModel from "../../../database/models/order.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";

// =================================  createReview  ==================================================
export const createReview = catchAsyncHandler(async (req, res, next) => {
    const { rate, comment } = req.body;
    const { productId } = req.params;

    const product = await productModel.findOne({ _id: productId })
    if (!product) {
        return next(new AppError("product not found", 404))
    }

    const reviewExist = await reviewModel.findOne({ createdBy: req.user._id, productId })
    if (reviewExist) {
        return next(new AppError("sorry, you have reviewed this product before", 400))
    }

    const order = await orderModel.findOne({
        user: req.user._id,
        "products.productId": productId,
        status: "delivered"
    })

    if (!order) {
        return next(new AppError("sorry, you can't review on this product", 400))
    }

    const review = await reviewModel.create({
        rate,
        comment,
        productId,
        createdBy: req.user._id
    })

    let sum = product.rateAvg * product.rateNum;
    sum += rate;
    product.rateAvg = sum / (++product.rateNum)

    await product.save();

    res.status(201).json({ msg: "review Added Successfully", review })
})


// =================================  deleteReview  ==================================================
export const deleteReview = catchAsyncHandler(async (req, res, next) => {
    const { productId, reviewId } = req.params;

    const review = await reviewModel.findOneAndDelete({ _id: reviewId, productId, createdBy: req.user._id })
    if (!review) {
        return next(new AppError("review not exist", 404))
    }

    const product = await productModel.findById(productId);

    let sum = product.rateAvg * product.rateNum;
    sum -= review.rate;
    product.rateAvg = sum / ((product.rateNum - 1) || 1)
    product.rateNum -= 1;

    // console.log(product.rateNum);

    await product.save();

    res.status(201).json({ msg: "review deleted Successfully" })
})


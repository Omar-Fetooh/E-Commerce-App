import couponModel from "../../../database/models/coupon.model.js";
import { AppError, catchAsyncHandler } from "../../utils/error.js";

// =================================  createCoupon  ==================================================
export const createCoupon = catchAsyncHandler(async (req, res, next) => {
    const { code, amount, fromDate, toDate } = req.body;

    const couponExist = await couponModel.findOne({ code });
    if (couponExist)
        return next(new AppError("coupon already exists", 409))



    const coupon = await couponModel.create({
        code,
        amount,
        fromDate,
        toDate,
        createdBy: req.user._id,

    })

    res.status(201).json({ msg: "coupon Added Successfully", coupon })
})
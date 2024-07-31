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

// =================================  updateCoupon  ==================================================
export const updateCoupon = catchAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { code, amount, fromDate, toDate } = req.body;
    const coupon = await couponModel.findOneAndUpdate(
        { _id: id, createdBy: req.user._id },
        {
            code,
            amount,
            fromDate,
            toDate
        },
        {
            new: true
        }
    );
    if (!coupon)
        return next(new AppError("coupon does not exist or you don't have permission", 404))


    res.status(201).json({ msg: "coupon updated Successfully", coupon })
})
import { Coupon, User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";

export const createCoupon = async (req, res, next) => {
  const { couponCode, couponAmount, couponType, from, till, Users } = req.body;

  const isCouponExists = await Coupon.findOne({ couponCode });
  if (isCouponExists) {
    next(new ErrorClass("Coupon already exists", 400));
  }

  const userIds = Users.map((user) => user.userId);
  const validUsers = await User.find({ _id: { $in: userIds } });

  if (userIds.length !== validUsers.length) {
    return next(new ErrorClass("Invalid userId ", 400));
  }

  const coupon = new Coupon({
    couponCode,
    couponAmount,
    couponType,
    from,
    till,
    Users,
    createdBy: req.authUser._id,
  });

  await coupon.save();

  res.status(201).json({
    status: "Success",
    message: "Coupon Created Successfully",
    coupon,
  });
};

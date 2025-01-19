import { Coupon, CouponChangeLog, User } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";

export const createCoupon = async (req, res, next) => {
  const { couponCode, couponAmount, couponType, from, till, Users } = req.body;

  const isCouponExists = await Coupon.findOne({ couponCode });
  if (isCouponExists) {
    return next(new ErrorClass("Coupon already exists", 400));
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

export const getCoupons = async (req, res, next) => {
  const { isEnable } = req.query;

  const filters = {};

  if (isEnable) {
    filters.isEnable = isEnable === "true" ? true : false;
  }

  const coupons = await Coupon.find({ isEnable });

  res.status(200).json({
    status: "Success",
    message: "coupons fetched Successfully",
    coupons,
  });
};

export const getCouponById = async (req, res, next) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    return next(new ErrorClass("coupon not found ", 404));
  }

  res.status(200).json({
    status: "Success",
    message: "Coupon Fetched successfully",
    coupon,
  });
};

export const updateCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const userId = req.authUser._id;
  const { couponCode, couponAmount, couponType, from, till, Users } = req.body;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next(new ErrorClass("Coupon doesn't exists", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorClass("User Id is not correct", 400));
  }

  const couponChangeLogObject = { couponId, updatedBy: userId, changes: {} };

  if (couponCode) {
    const isCouponRedundat = await Coupon.findOne({ couponCode });
    if (isCouponRedundat) {
      return next(new ErrorClass("Coupon Code already exists", 400));
    }
    coupon.couponCode = couponCode;
    couponChangeLogObject.changes.couponCode = couponCode;
  }

  if (from) {
    coupon.from = from;
    couponChangeLogObject.changes.from = from;
  }
  if (till) {
    coupon.till = till;
    couponChangeLogObject.changes.till = till;
  }
  if (couponAmount) {
    coupon.couponAmount = couponAmount;
    couponChangeLogObject.changes.couponAmount = couponAmount;
  }
  if (couponType) {
    coupon.couponType = couponType;
    couponChangeLogObject.changes.couponType = couponType;
  }
  if (Users) {
    const userIds = Users.map((user) => user.userId);
    const validUsers = await User.find({ _id: { $in: userIds } });

    if (userIds.length !== validUsers.length) {
      return next(new ErrorClass("Invalid userId ", 400));
    }
    coupon.Users = Users;
    couponChangeLogObject.changes.Users = Users;
  }

  await coupon.save();

  const couponChangeLog = new CouponChangeLog(couponChangeLogObject).save();
  res
    .status(200)
    .json({ message: "Coupon updated successfully", coupon, couponChangeLog });
};

export const disableEnableCoupon = async (req, res, next) => {
  const { couponId } = req.params;
  const userId = req.authUser._id;
  const { isEnable } = req.body;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    return next(new ErrorClass("Coupon doesn't exists", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorClass("User Id is not correct", 400));
  }
  const couponChangeLogObject = { couponId, updatedBy: userId, changes: {} };

  if (isEnable === true) {
    coupon.isEnable = true;
    couponChangeLogObject.changes.isEnable = true;
  }
  if (isEnable === false) {
    coupon.isEnable = false;
    couponChangeLogObject.changes.isEnable = false;
  }

  await coupon.save();

  const couponChangeLog = new CouponChangeLog(couponChangeLogObject).save();
  res
    .status(200)
    .json({ message: "Coupon updated successfully", coupon, couponChangeLog });
};

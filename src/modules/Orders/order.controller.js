import { DateTime } from "luxon";
import { Address, Cart, Order } from "../../../DB/Models/index.js";
import { ErrorClass, OrderStatus, PaymentMethods } from "../../Utils/index.js";
import { applyCoupon, validateCoupon } from "./Utils/order.utils.js";

export const createOrder = async (req, res, next) => {
  const userId = req.authUser._id;
  const {
    address,
    addressId,
    contactNumber,
    couponCode,
    // subTotal,
    shippingFee,
    VAT,
    paymentMethod,
  } = req.body;

  const cart = await Cart.findOne({ userId }).populate(
    "products.productId",
    "title stock price"
  );
  if (!cart || !cart.products.length) {
    return next(new ErrorClass("Empty Cart", 400));
  }

  const isOutOfStock = cart.products.find(
    (p) => p.productId.stock < p.quantity
  );
  if (isOutOfStock) {
    return next(
      new ErrorClass(
        `The Product ${isOutOfStock.productId.title} is out of stock. Please update your cart.`,
        400
      )
    );
  }

  const subTotal = cart.products.reduce(
    (total, p) => total + p.quantity * p.price,
    0
  );
  let total = subTotal;

  let coupon = null;
  if (couponCode) {
    const isCouponValid = await validateCoupon(couponCode, userId);

    if (isCouponValid?.error) {
      return next(new ErrorClass(isCouponValid.message, 400));
    }

    coupon = isCouponValid.coupon;
    total = applyCoupon(subTotal, coupon) + shippingFee + VAT;
  }

  if (!addressId && !address)
    return next(new ErrorClass("Address is Required", 400));

  if (addressId) {
    const addressInfo = await Address.findOne({ _id: addressId, userId });
    if (!addressInfo) return next(new ErrorClass("Invalid Address", 400));
  }

  let orderStatus = OrderStatus.Pending;

  if (paymentMethod === PaymentMethods.Cash) orderStatus = OrderStatus.Placed;

  const orderObj = new Order({
    userId,
    products: cart.products,
    address,
    addressId,
    contactNumber,
    couponId: coupon?._id,
    subTotal,
    shippingFee,
    VAT,
    total,
    paymentMethod,
    orderStatus,
    estimatedDeliveryDate: DateTime.now().plus({ days: 3 }),
  });

  const order = await orderObj.save();

  cart.products = [];
  cart.subTotal = 0;
  await cart.save();

  res.status(201).json({ message: "order created Successfully", order });
};

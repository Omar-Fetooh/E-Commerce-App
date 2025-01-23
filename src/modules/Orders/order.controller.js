import { DateTime } from "luxon";
import { Address, Cart, Order, Product } from "../../../DB/Models/index.js";
import {
  ApiFeatures,
  ErrorClass,
  OrderStatus,
  PaymentMethods,
} from "../../Utils/index.js";
import { applyCoupon, validateCoupon } from "./Utils/order.utils.js";
import {
  createCheckoutSession,
  createStripeCoupon,
} from "../../payment-handler/stripe.js";

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

export const cancelOrder = async (req, res, next) => {
  const userId = req.authUser._id;
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: {
      $in: [OrderStatus.Pending, OrderStatus.Placed, OrderStatus.Confirmed],
    },
  });

  if (!order) {
    return next(new ErrorClass("Order not found", 400));
  }

  const orderDate = DateTime.fromJSDate(order.createdAt);
  const currentDate = DateTime.now();

  const diff = Math.ceil(
    Number(currentDate.diff(orderDate, "days").toObject().days).toFixed(2)
  );

  console.log(diff);

  if (diff > 3) {
    return next(
      new ErrorClass("Sorry order has been bought more than 3 days", 400)
    );
  }

  order.orderStatus = OrderStatus.Cancelled;
  order.canceledBy = userId;
  order.canceledAt = DateTime.now();

  await order.save();

  const updatePromises = order.products.map((product) =>
    Product.updateOne(
      { _id: product.productId },
      { $inc: { stock: product.quantity } }
    )
  );

  await Promise.all(updatePromises);

  res.status(200).json({ message: "Order Cancelled Successfully", order });
};

export const deliverOrder = async (req, res, next) => {
  const userId = req.authUser._id;
  const { orderId } = req.params;

  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: {
      $in: [OrderStatus.Pending, OrderStatus.Placed, OrderStatus.Confirmed],
    },
  });

  if (!order) {
    return next(new ErrorClass("Order not found", 400));
  }

  order.orderStatus = OrderStatus.Delivered;
  order.deliveredBy = userId;
  order.deliverdAt = DateTime.now();

  await order.save();

  res.status(200).json({ message: "ordered Delivered", order });
};

export const listOrders = async (req, res, next) => {
  const mongooseQuery = Order.find();
  const userId = req.authUser._id;

  const query = { userId, ...req.query };

  const ApiFeaturesInstance = new ApiFeatures(mongooseQuery, query)
    .pagination()
    .sort()
    .filters();

  const orders = await ApiFeaturesInstance.mongooseQuery;

  res.status(200).json({
    status: "Success",
    message: "orders Fetched Successfully",
    orders,
  });
};

export const payWithStripe = async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.authUser._id;

  const order = await Order.findOne({
    _id: orderId,
    userId,
    orderStatus: OrderStatus.Pending,
  }).populate([
    {
      path: "userId",
      select: "email -_id",
    },
    {
      path: "products.productId",
      select: "title -_id",
    },
  ]);

  if (!order) {
    return next(new ErrorClass("Order not found or can't be paid", 404));
  }

  const paymentObj = {
    customer_email: order.userId.email,
    metadata: { orderId: order._id.toString() },
    discounts: [],
    line_items: order.products.map((product) => {
      return {
        price_data: {
          currency: "EGP",
          product_data: {
            name: product.productId.title,
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      };
    }),
    success_url: process.env.SUCCESS_URL,
    cancel_url: process.env.CANCEL_URL,
  };

  if (order.couponId) {
    const stripeCoupon = await createStripeCoupon({ couponId: order.couponId });
    if (stripeCoupon.status)
      return next(new ErrorClass(stripeCoupon.message, 400));

    paymentObj.discounts.push({ coupon: stripeCoupon.id });
  }

  const checkoutSession = await createCheckoutSession(paymentObj);

  res.status(200).json({ checkoutSession });
};

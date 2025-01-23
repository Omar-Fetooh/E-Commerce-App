import Stripe from "stripe";
import { Coupon } from "../../DB/Models/index.js";
import { CouponType, ErrorClass } from "../Utils/index.js";

export const createCheckoutSession = async ({
  customer_email,
  metadata,
  success_url,
  cancel_url,
  discounts,
  line_items,
}) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const paymentData = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email,
    metadata,
    success_url,
    cancel_url,
    discounts,
    line_items,
  });

  return paymentData;
};

export const createStripeCoupon = async ({ couponId }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const coupon = await Coupon.findById(couponId);
  if (!coupon) return next(new ErrorClass("coupon not found", 404));

  let couponObject = {};

  if (coupon.couponType === CouponType.FIXED) {
    couponObject = {
      name: coupon.couponCode,
      amount_off: coupon.couponAmount * 100,
      currency: "EGP",
    };
  } else if (coupon.couponType === CouponType.PERCENTAGE) {
    couponObject = {
      name: coupon.couponCode,
      percent_off: coupon.couponAmount,
    };
  }

  const stripeCoupon = await stripe.coupons.create(couponObject);

  return stripeCoupon;
};

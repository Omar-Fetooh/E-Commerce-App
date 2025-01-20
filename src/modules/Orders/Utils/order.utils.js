import { DateTime } from "luxon";
import { Coupon } from "../../../../DB/Models/index.js";
import { DiscountType } from "../../../Utils/enums.utils.js";

/**
 *
 * @param {*} couponCode
 * @param {*} userId
 * @returns {message:string, error:Bollean, coupon:Object}
 */
export const validateCoupon = async (couponCode, userId) => {
  const coupon = await Coupon.findOne({ couponCode });
  if (!coupon) return { message: "Invalid coupon code", error: true };

  if (
    coupon.isEnable === false ||
    DateTime.fromJSDate(coupon.till) < DateTime.now()
  )
    return { message: "coupon code isn't enabled ", error: true };

  const isUserNotEligible = coupon.Users.some(
    (u) =>
      u.userId.toString() !== userId.toString() || u.maxCount <= u.usageCount
  );

  if (isUserNotEligible)
    return {
      message:
        "User is not eligible to use this coupon or has reedem all tries",
      error: true,
    };

  return { error: false, coupon };
};

export const applyCoupon = (subTotal, coupon) => {
  let total = subTotal;

  const { couponAmount: discountAmount, couponType: discountType } = coupon;

  if (discountAmount && discountType) {
    if (discountType == DiscountType.PERCENTAGE) {
      total = subTotal * ((100 - discountAmount) / 100); // 30% sale and price is 100 ====>> 100 * ((100-30)/100)
    } else if (discountType == DiscountType.FIXED) {
      if (discountAmount > subTotal) {
        return total;
      }
      total -= discountAmount;
    }
  }

  return total;
};

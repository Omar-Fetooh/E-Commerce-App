import { DiscountType } from "./index.js";

export const calculateProductPrice = (price, discount) => {
  let appliedPrice = price;

  if (discount.type == DiscountType.PERCENTAGE) {
    appliedPrice = price * ((100 - discount.amount) / 100); // 30% sale and price is 100 ====>> 100 * ((100-30)/100)
  } else if (discount.type == DiscountType.FIXED) {
    appliedPrice -= discount.amount;
  }

  return appliedPrice;
};

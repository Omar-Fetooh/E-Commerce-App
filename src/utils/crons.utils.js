import { scheduleJob } from "node-schedule";
import { Coupon } from "../../DB/Models/index.js";
import { DateTime } from "luxon";

export const disableCouponCronJob = () => {
  scheduleJob("0 59 23 * * *", async () => {
    console.log("Cron job executed ");

    const enabledCoupons = await Coupon.find({ isEnable: true });

    if (enabledCoupons.length) {
      for (const coupon of enabledCoupons) {
        if (DateTime.now() > DateTime.fromJSDate(coupon.till)) {
          coupon.isenabled = false;
          await coupon.save();
        }
      }
    }
  });
};

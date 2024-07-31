import { Router } from "express"
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import { createCouponSchmea, updateCouponSchmea } from "./copoun.validaitons.js";
import * as CC from "../coupon/coupon.controllers.js"
const couponRouter = Router();

couponRouter.post("/",
    validation(createCouponSchmea),
    auth(["admin"]),
    CC.createCoupon)

couponRouter.put("/:id",
    validation(updateCouponSchmea),
    auth(["admin"]),
    CC.updateCoupon)

export default couponRouter;
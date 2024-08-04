import { Router } from "express"
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import { cancelOrderSchmea, createOrderSchmea } from "./order.validaitons.js";
import * as OC from "../order/order.controllers.js"
const orderRouter = Router();

orderRouter.post("/",
    validation(createOrderSchmea),
    auth(["admin"]),
    OC.createOrder)

orderRouter.put("/:id",
    validation(cancelOrderSchmea),
    auth(["admin"]),
    OC.cancelOrder)

export default orderRouter;
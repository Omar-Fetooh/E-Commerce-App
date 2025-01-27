import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";
import {
  cancelOrder,
  createOrder,
  deliverOrder,
  listOrders,
  payWithStripe,
  stripeWebhookLocal,
} from "./order.controller.js";

const { auth, errorHandler } = middlewares;

export const orderRouter = Router();

orderRouter.post("/create", auth(), errorHandler(createOrder));

orderRouter.put("/cancel/:orderId", auth(), errorHandler(cancelOrder));

orderRouter.put("/deliver/:orderId", auth(), errorHandler(deliverOrder));

orderRouter.get("/", auth(), errorHandler(listOrders));

orderRouter.post("/stripe-pay/:orderId", auth(), errorHandler(payWithStripe));

orderRouter.post("/webhook", errorHandler(stripeWebhookLocal));

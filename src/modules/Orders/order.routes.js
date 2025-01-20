import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";
import { createOrder } from "./order.controller.js";

const { auth, errorHandler } = middlewares;

export const orderRouter = Router();

orderRouter.post("/create", auth(), errorHandler(createOrder));

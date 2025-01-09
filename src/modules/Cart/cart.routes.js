import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";
import { addCart } from "./cart.controller.js";

const { auth, errorHandler } = middlewares;

export const cartRouter = Router();

cartRouter.post("/add/:productId", auth(), errorHandler(addCart));

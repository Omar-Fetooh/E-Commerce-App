import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";
import {
  addCart,
  getCart,
  removeFromCart,
  updateCart,
} from "./cart.controller.js";

const { auth, errorHandler } = middlewares;

export const cartRouter = Router();

cartRouter.post("/add/:productId", auth(), errorHandler(addCart));

cartRouter.put("/update/:productId", auth(), errorHandler(updateCart));
cartRouter.put("/remove/:productId", auth(), errorHandler(removeFromCart));

cartRouter.get("/", auth(), errorHandler(getCart));

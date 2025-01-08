import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";
import {
  addAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from "./address.controller.js";

const { auth, errorHandler } = middlewares;

export const addressRouter = Router();

addressRouter.post("/add", auth(), errorHandler(addAddress));

addressRouter.put("/update/:addressId", auth(), errorHandler(updateAddress));

addressRouter.put(
  "/soft-delete/:addressId",
  auth(),
  errorHandler(deleteAddress)
);

addressRouter.get("/", auth(), errorHandler(getAllAddress));

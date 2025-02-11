import express from "express";
import cors from "cors";
import * as router from "./src/Modules/index.js";
import { globalResponse } from "./src/Middlewares/index.js";

export const routerHandler = (app) => {
  app.use(cors());
  app.use(express.json());

  app.use("/categories", router.categoryRouter);
  app.use("/sub-categories", router.subCategoryRouter);
  app.use("/brands", router.brandRouter);
  app.use("/products", router.productRouter);
  app.use("/users", router.userRouter);
  app.use("/address", router.addressRouter);
  app.use("/carts", router.cartRouter);
  app.use("/coupons", router.couponRouter);
  app.use("/orders", router.orderRouter);
  app.use("/reviews", router.reviewRouter);

  app.use("*", (req, res, next) => {
    res.status(404).json({ message: "Not found" });
  });

  app.use(globalResponse);
};

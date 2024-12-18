import { Router } from "express";
import { extensions } from "../../Utils/file-extensions.js";

import * as middlewares from "../../Middlewares/index.js";

import { Product } from "../../../DB/Models/index.js";

import {
  addProduct,
  listProducts,
  updateProduct,
} from "./product.controller.js";

const { getDocumentByName, multerHost, errorHandler } = middlewares;

export const productRouter = Router();

productRouter.post(
  "/add",
  multerHost({ allowedExtensions: extensions.Images }).array("images", 5),
  errorHandler(addProduct)
);

productRouter.put("/update/:productId", errorHandler(updateProduct));

productRouter.get("/", listProducts);

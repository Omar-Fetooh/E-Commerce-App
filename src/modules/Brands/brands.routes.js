import { Router } from "express";

import { extensions } from "../../Utils/file-extensions.js";

import * as middlewares from "../../Middlewares/index.js";
import { getDocumentByName } from "../../Middlewares/finders.middleware.js";
import { Brands } from "../../../DB/Models/brand.model.js";

import {
  createBrand,
  deleteBrand,
  getBrand,
  updateBrand,
} from "./brands.controller.js";

const { multerHost, errorHandler } = middlewares;

export const brandRouter = Router();

brandRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Brands),
  errorHandler(createBrand)
);

brandRouter.get("/", errorHandler(getBrand));

brandRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Brands),
  errorHandler(updateBrand)
);

brandRouter.delete("/delete/:_id", errorHandler(deleteBrand));

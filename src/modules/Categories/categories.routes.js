import { Router } from "express";

import { extensions } from "../../Utils/file-extensions.js";

import * as middlewares from "../../Middlewares/index.js";
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "./categories.controller.js";
import { getDocumentByName } from "../../Middlewares/finders.middleware.js";
import { Category } from "../../../DB/Models/category.model.js";

const { multerHost, errorHandler } = middlewares;

export const categoryRouter = Router();

categoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Category),
  errorHandler(createCategory)
);

categoryRouter.get("/", errorHandler(getCategory));

categoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(Category),
  errorHandler(updateCategory)
);

categoryRouter.delete("/delete/:_id", errorHandler(deleteCategory));

categoryRouter.get("/list", errorHandler(listCategories));

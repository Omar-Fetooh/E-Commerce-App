import { Router } from "express";
import { extensions } from "../../Utils/file-extensions.js";

import * as middlewares from "../../Middlewares/index.js";

import { SubCategory } from "../../../DB/Models/index.js";
import {
  createSubCategory,
  deleteSubCategory,
  getSubCategory,
  updateSubCategory,
} from "./sub-categories.controller.js";

const { getDocumentByName, multerHost, errorHandler } = middlewares;

export const subCategoryRouter = Router();

subCategoryRouter.post(
  "/create",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(SubCategory),
  errorHandler(createSubCategory)
);

subCategoryRouter.get("/", errorHandler(getSubCategory));

subCategoryRouter.put(
  "/update/:_id",
  multerHost({ allowedExtensions: extensions.Images }).single("image"),
  getDocumentByName(SubCategory),
  errorHandler(updateSubCategory)
);

subCategoryRouter.delete("/delete/:_id", errorHandler(deleteSubCategory));

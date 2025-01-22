import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";
import {
  addReview,
  approveOrRejectReview,
  listReviews,
} from "./review.controller.js";

const { auth, errorHandler } = middlewares;

export const reviewRouter = Router();

reviewRouter.post("/create", auth(), errorHandler(addReview));

reviewRouter.get("/", errorHandler(listReviews));

reviewRouter.put(
  "/approve-reject/:reviewId",
  auth(["admin"]),
  errorHandler(approveOrRejectReview)
);

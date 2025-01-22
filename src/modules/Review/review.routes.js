import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";
import { addReview } from "./review.controller.js";

const { auth, errorHandler } = middlewares;

export const reviewRouter = Router();

reviewRouter.post("/create", auth(), errorHandler(addReview));

// reviewRouter.put("/cancel/:reviewId", auth(), errorHandler(cancelreview));

// reviewRouter.put("/deliver/:reviewId", auth(), errorHandler(deliverreview));

// reviewRouter.get("/", auth(), errorHandler(listreviews));

import { Router } from "express"
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import { createReviewSchema, deleteReviewSchema } from "./review.validaitons.js";
import * as RC from "../review/review.controllers.js"
import { systemRoles } from "../../utils/systemRoles.js";

const reviewRouter = Router({ mergeParams: true });


reviewRouter.post("/",
    validation(createReviewSchema),
    auth(Object.values(systemRoles)),
    RC.createReview)

reviewRouter.delete("/:reviewId",
    validation(deleteReviewSchema),
    auth(Object.values(systemRoles)),
    RC.deleteReview)

export default reviewRouter;
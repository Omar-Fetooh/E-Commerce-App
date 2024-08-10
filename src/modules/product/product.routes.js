import { Router } from "express"
import { multerHost, validExtension } from "../../middlewares/multerLocal.js";
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import * as PC from "./product.controllers.js";
import { createProductSchema } from "./product.validations.js";
import reviewRouter from "../review/review.routes.js";
import wishListRouter from "../wishList/wishList.routes.js";
import { systemRoles } from "../../utils/systemRoles.js";

const productRouter = Router({ mergeParams: true });

productRouter.use("/:productId/reviews", reviewRouter)
productRouter.use("/:productId/wishList", wishListRouter)

productRouter.post("/",
    multerHost(validExtension.image).fields([
        { name: "image", maxCount: 1 },
        { name: "coverImages", maxCount: 3 }
    ]),
    validation(createProductSchema),
    auth(["admin"]),
    PC.createProduct)

productRouter.get("/",
    // auth(Object.values(systemRoles)),
    PC.getProducts
)

export default productRouter  
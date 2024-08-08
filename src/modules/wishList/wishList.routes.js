import { Router } from "express"
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import { createWishListSchema, removeWishListSchema } from "./wishList.validaitons.js";
import * as WC from "./wishList.controllers.js";
import { systemRoles } from "../../utils/systemRoles.js";

const wishListRouter = Router({ mergeParams: true });

wishListRouter.post("/",
    validation(createWishListSchema),
    auth(Object.values(systemRoles)),
    WC.createWishList)

wishListRouter.delete("/",
    validation(removeWishListSchema),
    auth(Object.values(systemRoles)),
    WC.removeWishList)


export default wishListRouter;
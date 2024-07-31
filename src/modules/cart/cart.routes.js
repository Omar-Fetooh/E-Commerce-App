import { Router } from "express"
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import { clearCartSchema, createCartSchema, deleteFromCartSchema } from "./cart.validaitons.js";
import * as CC from "./cart.controllers.js";
import { systemRoles } from "../../utils/systemRoles.js";

const cartRouter = Router();

cartRouter.post("/",
    validation(createCartSchema),
    auth(Object.values(systemRoles)),
    CC.createCart)

cartRouter.patch("/",
    validation(deleteFromCartSchema),
    auth(Object.values(systemRoles)),
    CC.deleteFromCart)

cartRouter.put("/",
    validation(clearCartSchema),
    auth(Object.values(systemRoles)),
    CC.clearCart)

export default cartRouter;
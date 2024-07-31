import { Router } from "express"
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import { createCartSchema } from "./cart.validaitons.js";
import * as CC from "./cart.controllers.js";
import { systemRoles } from "../../utils/systemRoles.js";

const cartRouter = Router();

cartRouter.post("/",
    validation(createCartSchema),
    auth(Object.values(systemRoles)),
    CC.createCart)


export default cartRouter;
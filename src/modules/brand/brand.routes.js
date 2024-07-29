import { Router } from "express"
import { multerHost, validExtension } from "../../middlewares/multerLocal.js";
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import { createBrandSchema, updateBrandSchema } from "./brand.validaitons.js";
import * as BC from "./brand.controllers.js";

const brandRouter = Router();

brandRouter.post("/",
    multerHost(validExtension.image).single("image"),
    validation(createBrandSchema),
    auth(["admin"]),
    BC.createBrand)

brandRouter.put("/:id",
    multerHost(validExtension.image).single("image"),
    validation(updateBrandSchema),
    auth(["admin"]),
    BC.updateBrand)

export default brandRouter;
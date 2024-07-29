import { Router } from "express"
import * as CC from "./category.controllers.js"
import { multerHost, validExtension } from "../../middlewares/multerLocal.js";
import { createCategorySchema } from "./category.validations.js";
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
const categoryRouter = Router();

categoryRouter.post("/",
    multerHost(validExtension.image).single("image"),
    validation(createCategorySchema),
    auth(["admin"]),
    CC.createCategory)

export default categoryRouter  
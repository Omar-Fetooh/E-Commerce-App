import { Router } from "express"
import { multerHost, validExtension } from "../../middlewares/multerLocal.js";
import { validation } from "../../middlewares/validation.js"
import { auth } from "../../middlewares/auth.js"
import * as SCC from "./subCategory.controllers.js";
import { createSubCategorySchema, updateSubCategorySchema } from "./subCategory.validations.js";
import { systemRoles } from "../../utils/systemRoles.js";

const subCategoryRouter = Router({ mergeParams: true });

subCategoryRouter.post("/",
    multerHost(validExtension.image).single("image"),
    validation(createSubCategorySchema),
    auth(["admin"]),
    SCC.createSubCategory)

subCategoryRouter.put("/:id",
    multerHost(validExtension.image).single("image"),
    validation(updateSubCategorySchema),
    auth(["admin"]),
    SCC.updateSubCategory)

subCategoryRouter.get("/", auth(Object.values(systemRoles)), SCC.getSubCategories)

export default subCategoryRouter  
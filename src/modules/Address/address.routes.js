import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";
import { addAddress } from "./address.controller.js";

const { auth, errorHandler } = middlewares;

export const addressRouter = Router();

addressRouter.post("/add", auth(), errorHandler(addAddress));

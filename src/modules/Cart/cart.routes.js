import { Router } from "express";

import * as middlewares from "../../Middlewares/index.js";

const { auth, errorHandler } = middlewares;

export const cartRouter = Router();

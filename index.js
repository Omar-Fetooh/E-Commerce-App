import express from "express";
import { config } from "dotenv";

import db_connection from "./DB/connection.js";
import * as router from "./src/Modules/index.js";
import { globalResponse } from "./src/Middlewares/error-handling.middleware.js";

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/categories", router.categoryRouter);
app.use("/sub-categories", router.subCategoryRouter);
app.use("/brands", router.brandRouter);
app.use("/products", router.productRouter);

app.use(globalResponse);
db_connection();

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

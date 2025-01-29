import express from "express";
import { config } from "dotenv";
import cors from "cors";

import db_connection from "./DB/connection.js";
import * as router from "./src/Modules/index.js";
import { globalResponse } from "./src/Middlewares/error-handling.middleware.js";
import { disableCouponCronJob } from "./src/Utils/index.js";
import { Server } from "socket.io";
import { establishConnection } from "./src/Utils/socket.io.utils.js";

config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/categories", router.categoryRouter);
app.use("/sub-categories", router.subCategoryRouter);
app.use("/brands", router.brandRouter);
app.use("/products", router.productRouter);
app.use("/users", router.userRouter);
app.use("/address", router.addressRouter);
app.use("/carts", router.cartRouter);
app.use("/coupons", router.couponRouter);
app.use("/orders", router.orderRouter);
app.use("/reviews", router.reviewRouter);

app.use(globalResponse);

disableCouponCronJob();

db_connection();

app.use("*", (req, res, next) => {
  // next({ message: "Not found" });
  res.status(404).json({ message: "Not found" });
});

app.get("/", (req, res) => res.send("Hello World!"));

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

const io = establishConnection(server);

io.on("connection", (socket) => {
  console.log("a user connected");
});

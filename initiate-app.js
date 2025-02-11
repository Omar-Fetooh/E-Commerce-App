import express from "express";
import { config } from "dotenv";

import db_connection from "./DB/connection.js";

import { disableCouponCronJob } from "./src/Utils/index.js";
import { establishConnection } from "./src/Utils/socket.io.utils.js";
import { routerHandler } from "./router-handler.js";

export const main = () => {
  config();

  const app = express();
  const port = process.env.PORT || 5000;

  //routers handler
  routerHandler(app);

  // database connection
  db_connection();

  // cron jobs
  disableCouponCronJob();
  app.get("/", (req, res) => res.send("Hello World!"));

  const server = app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
  );
  const io = establishConnection(server);

  io.on("connection", (socket) => {
    console.log("a user connected");
  });
};

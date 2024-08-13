import dotenv from "dotenv"
import path from 'path'
dotenv.config({ path: path.resolve("config/.env") });

import express from 'express'
import { initApp } from './src/initApp.js'
import { createInvoice } from "./src/utils/pdf.js";

const app = express()
// app.set("case sensitive routing", true)

initApp(app, express)


import connectionDB from '../database/dbConnection.js'
import * as routers from "../src/modules/index.routes.js"
import { deleteFromCloudinary } from './utils/deleteFromCloudinary.js'
import { deleteFromDb } from './utils/deleteFromDb.js'
import { AppError, globalErrorHandler } from './utils/error.js'
import cors from "cors"
export const initApp = (app, express) => {
    connectionDB()

    app.use(cors())
    app.use(express.json())

    // app.get("/", (req, res) => {
    //     res.status(200, "hello world")
    // })

    app.use("/users", routers.userRouter)
    app.use('/categories', routers.categoryRouter)
    app.use("/subCategories", routers.subCategoryRouter)
    app.use("/brands", routers.brandRouter)
    app.use("/products", routers.productRouter)
    app.use("/coupons", routers.couponRouter)
    app.use("/cart", routers.cartRouter)
    app.use("/orders", routers.orderRouter)
    app.use("/reviews", routers.reviewRouter)

    app.use('*', (req, res, next) => {
        next(new AppError(`invalid URL ${req.originalUrl} not found`, 404))
    })

    // app.use(globalErrorHandler, deleteFromCloudinary, deleteFromDb)
    app.use(globalErrorHandler)
    app.use(deleteFromCloudinary)
    app.use(deleteFromDb)

}
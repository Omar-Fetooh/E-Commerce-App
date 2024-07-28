import connectionDB from '../database/dbConnection.js'
connectionDB()
import * as routers from "../src/modules/index.routes.js"

export const initApp = (app, express) => {

    const port = process.env.PORT || 3000

    app.use(express.json())
    app.use("/users", routers.userRouter)

    app.use('*', (req, res, next) => {
        next(new AppError(`invalid URL ${req.originalUrl} not found`, 404))
    })

    app.use((err, req, res, next) => {
        const { message, statusCode } = err;
        res.status(statusCode || 500).json(message);
    })

    app.get('/', (req, res) => res.send('Hello World!'))
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
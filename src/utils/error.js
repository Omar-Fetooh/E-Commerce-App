export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }
}

export const catchAsyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}
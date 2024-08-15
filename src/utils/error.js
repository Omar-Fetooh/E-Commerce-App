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

export const globalErrorHandler = (err, req, res, next) => {
    const { message, statusCode } = err;
    res.status(statusCode || 500).json({ message, stack: err.stack });
    next()
}
import { ErrorClass } from "../Utils/index.js";

export const errorHandler = (API) => {
  return async (req, res, next) => {
    API(req, res, next)?.catch((err) => {
      console.log("Error in async handler scope");
      next(
        new ErrorClass(
          "Internal Server Error",
          { status: 400 },
          err.message,
          err.stack
        )
      );
    });
  };
};

export const globalResponse = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      message: "Fail Response",
      err_msg: err.message,
      err_location: err.location,
      err_data: err.data,
      err_stack: err.stack,
    });
  }
};

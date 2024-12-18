import { ErrorClass } from "../Utils/index.js";

export const getDocumentByName = (model) => {
  return async (req, res, next) => {
    const { name } = req.body;

    if (name) {
      const document = await model.findOne({ name });

      if (document) {
        return next(new ErrorClass("this name already exist", 400));
      }
    }

    next();
  };
};

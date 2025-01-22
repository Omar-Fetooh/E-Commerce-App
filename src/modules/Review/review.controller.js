import { Order, Product, Review } from "../../../DB/Models/index.js";
import { ErrorClass, OrderStatus } from "../../Utils/index.js";

export const addReview = async (req, res, next) => {
  const userId = req.authUser._id;
  const { productId, reviewRating, reviewBody } = req.body;

  const isAlreadyReviewed = await Review.findOne({ productId, userId });
  if (isAlreadyReviewed) {
    return next(
      new ErrorClass("sorry but you have already reviewed this product", 400)
    );
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorClass("Product not found", 404));
  }

  const didUserBought = await Order.findOne({
    userId,
    "products.productId": productId,
    orderStatus: OrderStatus.Delivered,
  });

  if (!didUserBought) {
    return next(
      new ErrorClass(
        "sorry , you should first buy the product to review it ",
        400
      )
    );
  }

  const reviewObj = {
    userId,
    productId,
    reviewRating,
    reviewBody,
  };

  const review = await Review.create(reviewObj);

  res.status(201).json({ message: "review created Succesfully", review });
};

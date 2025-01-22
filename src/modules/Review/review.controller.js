import { Order, Product, Review } from "../../../DB/Models/index.js";
import { ErrorClass, OrderStatus, ReviewStatus } from "../../Utils/index.js";

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

export const listReviews = async (req, res, next) => {
  const reviews = await Review.find().populate([
    {
      path: "userId",
      select: "userName email -_id",
    },
    {
      path: "productId",
      select: "title rating -_id",
    },
  ]);

  res.status(200).json({ message: "reviews fetched successfully", reviews });
};

export const approveOrRejectReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const { accept, reject } = req.body;

  if (accept && reject) {
    return next(new ErrorClass("please select accept or reject", 400));
  }

  const review = await Review.findByIdAndUpdate(reviewId, {
    reviewStatus: accept
      ? ReviewStatus.Accepted
      : reject
      ? ReviewStatus.Rejected
      : ReviewStatus.Pending,
  });

  res.status(200).json({ message: "Review updated Successfully", review });
};

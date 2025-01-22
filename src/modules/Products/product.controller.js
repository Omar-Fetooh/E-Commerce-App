import { nanoid } from "nanoid";

import {
  ApiFeatures,
  calculateProductPrice,
  cloudinaryConfig,
  ErrorClass,
  ReviewStatus,
} from "../../Utils/index.js";
import { Brands } from "../../../DB/Models/brand.model.js";
import { Product } from "../../../DB/Models/product.model.js";
import slugify from "slugify";

export const addProduct = async (req, res, next) => {
  const {
    title,
    overview,
    spec,
    price,
    discountAmount,
    discountType,
    stock,
    rating,
  } = req.body;

  if (!req.files.length) {
    return next(new ErrorClass("Please upload images ", 400));
  }

  const { brandId, subCategoryId, categoryId } = req.query;

  const brand = await Brands.findOne({
    _id: brandId,
    subCategoryId,
    categoryId,
  }).populate("subCategoryId categoryId");

  if (!brand) {
    next(new ErrorClass("Brand is not found", 404));
  }

  let appliedPrice = price;

  if (discountType == "Percentage") {
    appliedPrice = price * ((100 - discountAmount) / 100); // 30% sale and price is 100 ====>> 100 * ((100-30)/100)
  } else if (discountType == "Fixed") {
    appliedPrice -= discountAmount;
  }

  // uploading images

  let URLs = [];
  const customId = nanoid(4);

  const catgeoryCustomId = brand.categoryId.customId;
  const subCategoryCustomId = brand.subCategoryId.customId;
  const brandCustomId = brand.customId;

  const folder = `${process.env.UPLOADS_FOLDER}/Categories/${catgeoryCustomId}/SubCategories/${subCategoryCustomId}/Brands/${brandCustomId}/Products/${customId}`;

  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
      file.path,
      {
        folder,
      }
    );

    URLs.push({ secure_url, public_id });
  }

  const productObj = {
    title,
    overview,
    spec: JSON.parse(spec),
    appliedDiscount: {
      amount: discountAmount,
      type: discountType,
    },
    appliedPrice,
    stock,
    rating,
    Images: {
      URLs,
      customId,
    },
    categoryId,
    subCategoryId,
    brandId,
    price,
  };

  const product = await Product.create(productObj);

  res.status(201).json({
    status: "Success",
    message: "Product Created Successfully",
    product,
  });
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const {
    title,
    overview,
    spec,
    badge,
    price,
    discountAmount,
    discountType,
    stock,
  } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    next(new ErrorClass("Product not found", 404));
  }

  if (title) {
    product.title = title;
    product.slug = slugify(title, {
      replacement: "_",
      lower: true,
    });
  }

  if (overview) product.overview = overview;
  if (badge) product.badge = badge;
  if (stock) product.stock = stock;
  if (spec) product.spec = spec;

  if (price || discountAmount || discountType) {
    let newPrice = price || product.price;
    let discount = {};
    discount.amount = discountAmount || product.appliedDiscount.amount;
    discount.type = discountType || product.appliedDiscount.type;

    product.appliedPrice = calculateProductPrice(newPrice, discount);

    product.price = newPrice;
    product.discount = discount;
  }

  await product.save();

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
};

export const listProducts = async (req, res, next) => {
  const mongooseQuery = Product.find().populate({
    path: "Reviews",
    match: { reviewStatus: ReviewStatus.Accepted },
    select: "reviewRating reviewBody",
  });
  const ApiFeaturesInstance = new ApiFeatures(mongooseQuery, req.query)
    .pagination()
    .sort()
    .filters();

  const products = await ApiFeaturesInstance.mongooseQuery;

  res.status(200).json({
    status: "success",
    message: "Products fetched successfully",
    products,
  });
};

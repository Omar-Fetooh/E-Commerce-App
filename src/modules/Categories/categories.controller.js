import slugify from "slugify";
import { nanoid } from "nanoid";

import { Brands, Category, SubCategory } from "../../../DB/Models/index.js";

import { cloudinaryConfig } from "../../Utils/cloudinary.utils.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";
import { ApiFeatures } from "../../Utils/api-features.utils.js";

/**
 *@api {POST} /categories/create  create a new Category
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */

export const createCategory = async (req, res, next) => {
  const { name } = req.body;

  const slug = slugify(name, { replacement: "_", lower: true });

  if (!req.file) {
    return next(new ErrorClass("Please upload an image", 400));
  }
  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${customId}`,
    }
  );

  const category = {
    name,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
  };

  const newCategory = await Category.create(category);

  res
    .status(201)
    .json({ message: "Category created successfully", data: newCategory });
};

export const getCategory = async (req, res, next) => {
  const { id, name, slug } = req.query;

  const queryFilter = {};

  if (id) queryFilter._id = id;
  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;

  const category = await Category.find(queryFilter);

  if (!category) {
    return next(new ErrorClass("Category Not found", 404));
  }

  res.status(200).json({ message: "Category Fetched Successfully", category });
};

export const updateCategory = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.params;

  const category = await Category.findById(_id);
  if (!category) {
    return next(new ErrorClass("Category not found", 404));
  }

  if (name) {
    const slug = slugify(name, { replacement: "_", lower: true });
    category.name = name;
    category.slug = slug;
  }

  if (req.file) {
    const splitedPublic_id = category.Images.public_id.split(
      `${category.customId}/`
    )[1];

    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`,
        public_id: splitedPublic_id,
      }
    );

    category.Images.secure_url = secure_url;
  }

  await category.save();

  res
    .status(200)
    .json({ message: "Category updated Successfully", data: category });
};

export const deleteCategory = async (req, res, next) => {
  const { _id } = req.params;

  const category = await Category.findByIdAndDelete(_id);
  if (!category) {
    return next(new ErrorClass("Category not found", 404));
  }

  await cloudinaryConfig().api.delete_resources_by_prefix(
    `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`
  );

  await cloudinaryConfig().api.delete_folder(
    `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}`
  );

  res.status(200).json({
    status: "Success",
    message: "Category Deleted Successfully",
    data: category,
  });
};

export const listCategories = async (req, res, next) => {
  const mongooseQuery = Category.find();

  const ApiFeaturesInstance = new ApiFeatures(mongooseQuery, req.query)
    .pagination()
    .sort()
    .filters();

  const categories = await ApiFeaturesInstance.mongooseQuery;

  res.status(200).json({
    status: "Success",
    message: "Categories Fetched Successfully",
    categories,
  });
};

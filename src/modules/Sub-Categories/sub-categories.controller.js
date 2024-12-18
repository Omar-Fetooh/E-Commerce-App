import slugify from "slugify";
import { nanoid } from "nanoid";

import { Brands, Category, SubCategory } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";
import { cloudinaryConfig } from "../../Utils/cloudinary.utils.js";

export const createSubCategory = async (req, res, next) => {
  const { name } = req.body;
  const { categoryId } = req.query;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new ErrorClass("Category not found", 400));
  }

  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });

  if (!req.file) {
    return next(new ErrorClass("Please upload an image", 400));
  }

  const customId = nanoid(4);

  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${category.customId}/SubCategories/${customId}`,
    }
  );

  const subCategoryObj = {
    name,
    slug,
    Images: {
      secure_url,
      public_id,
    },
    customId,
    categoryId,
  };

  const subCategory = await SubCategory.create(subCategoryObj);

  console.log("hello");

  res.status(201).json({
    status: "Success",
    message: "SubCategory created Successfully",
    data: subCategory,
  });
};

export const getSubCategory = async (req, res, next) => {
  const { id, name, slug } = req.query;

  const queryFilter = {};

  if (id) queryFilter._id = id;
  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;

  const subCategory = await SubCategory.find(queryFilter);

  if (!subCategory) {
    return next(new ErrorClass("subCategory Not found", 404));
  }

  res
    .status(200)
    .json({ message: "subCategory Fetched Successfully", subCategory });
};

export const updateSubCategory = async (req, res, next) => {
  const { name } = req.body;
  const { _id } = req.params;

  const subCategory = await SubCategory.findById(_id).populate("categoryId");
  if (!subCategory) {
    return next(new ErrorClass("subCategory not found", 404));
  }

  if (name) {
    const slug = slugify(name, { replacement: "_", lower: true });
    subCategory.name = name;
    subCategory.slug = slug;
  }

  if (req.file) {
    const splitedPublic_id = subCategory.Images.public_id.split(
      `${subCategory.customId}/`
    )[1];

    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/SubCategories/${subCategory.customId}`,
        public_id: splitedPublic_id,
      }
    );

    subCategory.Images.secure_url = secure_url;
  }

  await subCategory.save();

  res
    .status(200)
    .json({ message: "subCategory updated Successfully", data: subCategory });
};

export const deleteSubCategory = async (req, res, next) => {
  const { _id } = req.params;

  const subCategory = await SubCategory.findByIdAndDelete(_id).populate(
    "categoryId"
  );
  if (!subCategory) {
    return next(new ErrorClass("subCategory not found", 404));
  }

  await cloudinaryConfig().api.delete_resources_by_prefix(
    `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/SubCategories/${subCategory.customId}`
  );

  await cloudinaryConfig().api.delete_folder(
    `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/SubCategories/${subCategory.customId}`
  );

  // TODO delete Brands
  await Brands.deleteMany({ subCategoryId: subCategory._id });

  res.status(200).json({
    status: "Success",
    message: "SubCateory Deleted Successfully",
    data: subCategory,
  });
};

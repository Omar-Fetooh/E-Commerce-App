import slugify from "slugify";
import { nanoid } from "nanoid";

import { Brands, Category, SubCategory } from "../../../DB/Models/index.js";

import { cloudinaryConfig } from "../../Utils/cloudinary.utils.js";
import { ErrorClass } from "../../Utils/error-class.utils.js";

export const createBrand = async (req, res, next) => {
  const { name } = req.body;
  const { categoryId, subCategoryId } = req.query;

  const subCategory = await SubCategory.findOne({
    _id: subCategoryId,
    categoryId,
  }).populate("categoryId");

  if (!subCategory) {
    return next(new ErrorClass("SubCategory not found", 404));
  }

  const slug = slugify(name, {
    replacement: "_",
    lower: true,
  });

  if (!req.file) {
    return next(new ErrorClass("Please upload a logo image", 400));
  }

  const customId = nanoid(4);
  const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(
    req.file.path,
    {
      folder: `${process.env.UPLOADS_FOLDER}/Categories/${subCategory.categoryId.customId}/SubCategories/${subCategory.customId}/Brands/${customId}`,
    }
  );

  const brandObj = {
    name,
    slug,
    logo: {
      secure_url,
      public_id,
    },
    customId,
    categoryId,
    subCategoryId,
  };

  const brand = await Brands.create(brandObj);

  res.status(201).json({
    status: "Success",
    message: "Brand Created Successfully",
    brand,
  });
};

export const getBrand = async (req, res, next) => {
  const { id, name, slug } = req.query;

  const queryFilter = {};

  if (id) queryFilter._id = id;
  if (name) queryFilter.name = name;
  if (slug) queryFilter.slug = slug;

  const brand = await Brands.find(queryFilter);

  if (!brand) {
    return next(new ErrorClass("brand Not found", 404));
  }

  res.status(200).json({ message: "brand Fetched Successfully", brand });
};

export const updateBrand = async (req, res, next) => {
  const { _id } = req.params;
  const brand = await Brands.findById(_id)
    .populate("categoryId")
    .populate("subCategoryId");

  if (!brand) {
    return next(new ErrorClass("Brand Not found", 404));
  }

  const { name } = req.body;

  if (name) {
    const slug = slugify(name, {
      replacement: "_",
      lower: true,
    });
    brand.name = name;
    brand.slug = slug;
  }

  if (req.file) {
    const splitedPublic_id = brand.logo.public_id.split(
      `${brand.customId}/`
    )[1];

    const { secure_url } = await cloudinaryConfig().uploader.upload(
      req.file.path,
      {
        folder: `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`,
        public_id: splitedPublic_id,
      }
    );

    brand.logo.secure_url = secure_url;
  }

  await brand.save();

  res.status(200).json({
    message: "Brand Updated Successfully",
    brand,
  });
};

export const deleteBrand = async (req, res, next) => {
  const { _id } = req.params;

  const brand = await Brands.findByIdAndDelete(_id)
    .populate("categoryId")
    .populate("subCategoryId");

  if (!brand) {
    return next(new ErrorClass("brand not found", 404));
  }

  await cloudinaryConfig().api.delete_resources_by_prefix(
    `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`
  );
  await cloudinaryConfig().api.delete_folder(
    `${process.env.UPLOADS_FOLDER}/Categories/${brand.categoryId.customId}/SubCategories/${brand.subCategoryId.customId}/Brands/${brand.customId}`
  );

  res.status(200).json({
    status: "Success",
    message: "Brand Deleted Successfully",
    data: brand,
  });
};

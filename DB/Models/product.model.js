import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

import slugify from "slugify";
import {
  Badges,
  DiscountType,
  calculateProductPrice,
} from "../../src/Utils/index.js";

export const productSchema = new Schema(
  {
    //====== String data =========\\
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      default: function () {
        return slugify(this.title, {
          lower: true,
          replacement: "_",
        });
      },
    },
    overview: String,
    spec: {
      type: Object,
    },
    badge: {
      type: String,
      enum: Object.values(Badges),
    },
    //====== Number data =========\\
    price: {
      type: Number,
      min: 0,
      required: true,
      default: function () {
        calculateProductPrice();
      },
    },
    appliedDiscount: {
      amount: {
        type: Number,
        min: 0,
        default: 0,
      },
      type: {
        type: String,
        enum: Object.values(DiscountType),
        default: DiscountType.PERCENTAGE,
      },
    },
    appliedPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },

    //======Images Data=========\\
    Images: {
      URLs: [
        {
          secure_url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
            unique: true,
          },
        },
      ],
      customId: {
        type: String,
        required: true,
        unique: true,
      },
    },

    //======IDs Data=========\\
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, //TODO
    },
  },
  {
    timestamps: true,
  }
);

export const Product =
  mongoose.models.Product || model("Product", productSchema);

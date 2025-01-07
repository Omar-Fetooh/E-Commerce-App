import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: false,
    },
    Images: {
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
    customId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.post("findOneAndDelete", async function () {
  const _id = this.getQuery()._id;

  const deletedSubCategories = await mongoose.models.SubCategory.deleteMany({
    categoryId: _id,
  });

  if (deletedSubCategories.deletedCount) {
    const deletedBrands = await mongoose.models.Brands.deleteMany({
      categoryId: _id,
    });

    if (deletedBrands.deletedCount) {
      await mongoose.models.Product.deleteMany({
        categoryId: _id,
      });
    }
  }
});

export const Category =
  mongoose.models.CategoryModel || model("Category", categorySchema);

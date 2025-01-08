import mongoose from "../global-setup.js";
const { Schema, model } = mongoose;

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: Number,
      required: true,
    },
    buildingNumber: {
      type: Number,
      required: true,
    },
    floorNumber: {
      type: Number,
      required: true,
    },
    addressLabel: {
      type: String,
      required: false,
    },
    isDefault: {
      type: Boolean,
      required: false,
    },
    isMarkedAsDeleted: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true }
);

export const Address =
  mongoose.models.Address || model("Address", addressSchema);

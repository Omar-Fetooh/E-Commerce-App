// {
//     "appliedDiscount": {
//     "amount": 20,
//     "type": "Percentage"
//     },
//     "Images": {
//     "URLs": [
//     {
//     "secure_url": "https://res.cloudinary.com/dpfcr3fat/image/upload/v1736381492/Uploads/Categories/iUoZ/SubCategories/2Wc-/Brands/yJZO/Products/AlRP/uj4b4zo5vnh7lfblhs9i.png",
//     "public_id": "Uploads/Categories/iUoZ/SubCategories/2Wc-/Brands/yJZO/Products/AlRP/uj4b4zo5vnh7lfblhs9i",
//     "_id": "677f1434ded647b0de16a3c2",
//     "id": "677f1434ded647b0de16a3c2"
//     }
//     ],
//     "customId": "AlRP"
//     },
//     "_id": "677f1434ded647b0de16a3c1",
//     "title": "I phone 15 pro",
//     "overview": "very good phone ",
//     "spec": {
//     "color": "red",
//     "Display size": "7 inch"
//     },
//     "price": 10000,
//     "appliedPrice": 8000,
//     "stock": 5,
//     "rating": 2,
//     "categoryId": "677f133366b11ab44e0dbf55",
//     "subCategoryId": "677f136766b11ab44e0dbf5b",
//     "brandId": "677f13c166b11ab44e0dbf60",
//     "slug": "i_phone_15_pro",
//     "createdAt": "2025-01-09T00:11:32.967Z",
//     "updatedAt": "2025-01-27T23:10:47.858Z",
//     "__v": 0,
//     "Reviews": [
//     {
//     "_id": "67911df6d57594f33906c18b",
//     "productId": "677f1434ded647b0de16a3c1",
//     "reviewRating": 4,
//     "reviewBody": "it is ok "
//     }
//     ],
//     "id": "677f1434ded647b0de16a3c1"
// },

import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { DiscountType as discountTypeEnum } from "../../Utils/index.js";

const DiscountType = new GraphQLObjectType({
  name: "DiscountType",
  fields: {
    amount: {
      type: GraphQLFloat,
    },
    type: {
      type: new GraphQLEnumType({
        name: "DiscountTypeEnum",
        values: {
          percentage: { value: discountTypeEnum.PERCENTAGE },
          fixed: { value: discountTypeEnum.FIXED },
        },
      }),
    },
  },
});

const ImageType = new GraphQLObjectType({
  name: "ImageType",
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
    _id: { type: GraphQLID },
    // id: { type: GraphQLID },
  },
});

const ImagesType = new GraphQLObjectType({
  name: "ImagesType",
  fields: {
    URLs: { type: new GraphQLList(ImageType) },
    customId: { type: GraphQLString },
  },
});

const ReviewType = new GraphQLObjectType({
  name: "Review",
  fields: {
    _id: { type: GraphQLID },
    productId: { type: GraphQLID },
    reviewRating: { type: GraphQLInt },
    reviewBody: { type: GraphQLString },
  },
});

export const ProductType = new GraphQLObjectType({
  name: "Product",
  description: "This is a product Type",
  fields: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    overview: { type: GraphQLString },
    spec: {
      type: new GraphQLObjectType({
        name: "Spec",
        fields: {
          color: { type: GraphQLString },
          DisplaySize: { type: GraphQLString },
        },
      }),
    },
    price: { type: GraphQLFloat },
    appliedPrice: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    rating: { type: GraphQLInt },
    categoryId: { type: GraphQLID },
    subCategoryId: { type: GraphQLID },
    brandId: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    appliedDiscount: { type: DiscountType },
    Images: { type: ImagesType },
    Reviews: { type: new GraphQLList(ReviewType) },
    id: { type: GraphQLID },
  },
});

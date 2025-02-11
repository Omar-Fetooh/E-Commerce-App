import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { DiscountType } from "../../Utils/index.js";

export const couponTypeEnum = new GraphQLEnumType({
  name: "CouponTypeEnum",
  values: {
    percentage: { value: DiscountType.PERCENTAGE },
    fixed: { value: DiscountType.FIXED },
  },
});

export const couponType = new GraphQLObjectType({
  name: "CouponType",
  fields: {
    _id: { type: GraphQLID },
    couponCode: { type: GraphQLString },
    couponAmount: { type: GraphQLFloat },
    couponType: { type: couponTypeEnum },
    from: { type: GraphQLString },
    till: { type: GraphQLString },
    isEnable: { type: GraphQLBoolean },
    createdBy: { type: GraphQLID },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

export const createCouponArgs = {
  couponCode: { type: GraphQLString },
  couponAmount: { type: GraphQLFloat },
  couponType: { type: couponTypeEnum },
  from: { type: GraphQLString },
  till: { type: GraphQLString },
};

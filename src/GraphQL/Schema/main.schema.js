import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { ProductType } from "../Types/product.type.js";
import { listProductsResolver } from "../Resolvers/list-products.resolver.js";
import { createCouponResolver } from "../Resolvers/create-coupon.resolver.js";
import { couponType, createCouponArgs } from "../Types/coupon.type.js";

export const mainSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "RootQuery",
    description: "just testing a root Query ",
    fields: {
      listProducts: {
        name: "list products",
        description: "a simple query to list products",
        type: new GraphQLList(ProductType),
        resolve: listProductsResolver,
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: "RootMutation",
    description: "this is a root mutation",
    fields: {
      createCoupon: {
        name: "createCoupon",
        type: couponType,
        args: createCouponArgs,
        resolve: createCouponResolver,
      },
    },
  }),
});

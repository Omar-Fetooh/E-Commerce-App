import { Product } from "../../../DB/Models/index.js";

export const listProductsResolver = async () => {
  return await Product.find();
};

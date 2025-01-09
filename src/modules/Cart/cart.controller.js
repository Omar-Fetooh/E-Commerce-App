import { Product, Cart } from "../../../DB/Models/index.js";
import { ErrorClass } from "../../Utils/index.js";

export const addCart = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.authUser._id;
  const { quantity } = req.body;

  const product = await Product.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });

  if (!product) {
    return next(new ErrorClass("product not found or out of stock "));
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    const subTotal = product.appliedPrice * quantity;
    const newCart = new Cart({
      userId,
      products: [
        {
          productId: product._id,
          quantity: quantity,
          price: product.appliedPrice,
        },
      ],
      subTotal,
    });

    await newCart.save();
    return res.status(201).json({
      status: "Success",
      message: "Product added to cart successfully",
      cart: newCart,
    });
  }

  const isProductExist = cart.products.find((p) => p.productId == productId);

  if (isProductExist) {
    return next(new ErrorClass("Product already exists in cart", 400));
  }

  cart.products.push({ productId, quantity, price: product.appliedPrice });

  cart.subTotal += product.quantity * product.appliedPrice;

  await cart.save();
  return res.status(201).json({
    status: "Success",
    message: "Product added to cart successfully",
    cart,
  });
};

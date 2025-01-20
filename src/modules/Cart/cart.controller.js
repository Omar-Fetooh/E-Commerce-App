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
    return next(new ErrorClass("product not found or out of stock ", 400));
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

  cart.subTotal += quantity * product.appliedPrice;

  await cart.save();
  return res.status(201).json({
    status: "Success",
    message: "Product added to cart successfully",
    cart,
  });
};

export const updateCart = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const userId = req.authUser._id;

  const product = await Product.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });

  if (!product) {
    return next(new ErrorClass("product not found or out of stock", 400));
  }

  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) {
    return next(new ErrorClass("Product not in cart", 400));
  }

  const productIndex = cart.products.findIndex((p) => p.productId == productId);
  cart.products[productIndex].quantity = quantity;

  const subTotal = cart.products.reduce(
    (total, p) => total + p.quantity * p.price,
    0
  );
  cart.subTotal = subTotal;

  await cart.save();

  return res.status(200).json({
    status: "Success",
    message: "Cart Updated Successfully",
    cart,
  });
};

export const removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const userId = req.authUser._id;

  const cart = await Cart.findOne({ userId, "products.productId": productId });
  if (!cart) {
    return next(new ErrorClass("user doesn't have cart", 400));
  }

  cart.products = cart.products.filter((p) => {
    p.productId !== productId;
  });

  if (cart.products.length == 0) {
    await Cart.deleteOne({ userId });
    return res.status(200).json({
      status: "Success",
      message: "Product removed from cart Successfully",
    });
  }

  cart.subTotal = cart.products.reduce(
    (total, p) => total + p.quantity * p.price,
    0
  );

  await cart.save();
  return res.status(200).json({
    status: "Success",
    message: "Product removed from cart Successfully",
    cart,
  });
};

export const getCart = async (req, res, next) => {
  const userId = req.authUser._id;

  const cart = await Cart.findOne({ userId });

  return res.status(200).json({
    status: "Success",
    message: "Cart fetched Successfully",
    cart,
  });
};

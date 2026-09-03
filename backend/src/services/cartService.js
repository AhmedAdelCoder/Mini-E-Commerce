import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCartService = async (
  userId,
  productId,
  quantity
) => {
  // Check if product exists
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  // Get user cart
  let cart = await Cart.findOne({ user: userId });

  //! Create cart if it doesn't exist
  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
        },
      ],
    });

    return cart;
  }

  //todo Check if product already exists in cart
  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return cart;
};

export const getCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product");

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  return cart;
};

// update quan to cart
export const updateCartItemService = async (
  userId,
  productId,
  quantity
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    const error = new Error("Product not found in cart");
    error.statusCode = 404;
    throw error;
  }

  item.quantity = quantity;

  await cart.save();

  return cart;
};

//! remove product from cart
export const removeFromCartService = async (
  userId,
  productId
) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId
  );

  if (!itemExists) {
    const error = new Error("Product not found in cart");
    error.statusCode = 404;
    throw error;
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  return cart;
};
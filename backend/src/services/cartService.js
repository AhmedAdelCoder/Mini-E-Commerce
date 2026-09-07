import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const populateCartProducts = (cart) => cart.populate("items.product");

const createStockError = (product) => {
  const error = new Error(`Insufficient stock for product: ${product.name}`);
  error.statusCode = 400;
  return error;
};

export const addToCartService = async (
  userId,
  productId,
  quantity
) => {
  //! Check if product exists
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });

  const existingItem = cart?.items.find(
    (item) => item.product.toString() === productId
  );
  const requestedQuantity = (existingItem?.quantity ?? 0) + quantity;

  if (requestedQuantity > product.stock) {
    throw createStockError(product);
  }

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

    return populateCartProducts(cart);
  }

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return populateCartProducts(cart);
};

export const getCartService = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

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

  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > product.stock) {
    throw createStockError(product);
  }

  item.quantity = quantity;

  await cart.save();

  return populateCartProducts(cart);
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

  return populateCartProducts(cart);
};
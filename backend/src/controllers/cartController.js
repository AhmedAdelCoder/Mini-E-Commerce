import {
  addToCartService,
  getCartService,
  updateCartItemService,
  removeFromCartService,
} from "../services/cartService.js";


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    const cart = await addToCartService(
      req.user.userId,
      productId,
      quantity
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to add product to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await getCartService(req.user.userId);

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to get cart",
    });
  }
};

// update
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await updateCartItemService(
      req.user.userId,
      productId,
      quantity
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated successfully",
      cart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to update cart item",
    });
  }
};


//remove
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await removeFromCartService(
      req.user.userId,
      productId
    );

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Failed to remove product from cart",
    });
  }
};
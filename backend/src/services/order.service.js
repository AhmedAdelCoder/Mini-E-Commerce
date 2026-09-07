import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/order.model.js";

const VALID_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];


export const createOrderService = async (userId, shippingAddress) => {
  const session = await mongoose.startSession();

  try {
    let order;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: userId }).session(session);

      if (!cart) {
        const error = new Error("Cart not found");
        error.statusCode = 404;
        throw error;
      }

      if (cart.items.length === 0) {
        const error = new Error("Cart is empty");
        error.statusCode = 400;
        throw error;
      }

      const orderItems = [];
      let totalAmount = 0;

      for (const item of cart.items) {

        const product = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );

        if (!product) {
          const existing = await Product.findById(item.product).session(session);
          const error = new Error(
            existing
              ? `Insufficient stock for product: ${existing.name}`
              : `Product ${item.product} not found`
          );
          error.statusCode = existing ? 400 : 404;
          throw error;
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
        });

        totalAmount += product.price * item.quantity;
      }

      const createdOrders = await Order.create(
        [{ user: userId, items: orderItems, shippingAddress, totalAmount, status: "pending" }],
        { session }
      );

      order = createdOrders[0];


      cart.items = [];
      await cart.save({ session });
    });

    return order;
  } finally {
    session.endSession();
  }
};


export const getMyOrdersService = async (userId) => {
  return Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
};


export const getAllOrdersService = async ({ status, page = 1, limit = 20 }) => {
  const filter = {};
  if (status && VALID_STATUSES.includes(status)) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email")
      .lean(),
    Order.countDocuments(filter),
  ]);

  return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
};


export const updateOrderStatusService = async (orderId, status) => {
  if (!VALID_STATUSES.includes(status)) {
    const error = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`);
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  ).populate("user", "name email");

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/order.model.js";

export const createOrderService = async (userId) => {
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

      
      const createdOrders = await Order.create([{
        user: userId,
        items: orderItems,
        totalAmount,
        status: "pending",
      }], { session });

      order = createdOrders[0];

      
      cart.items = [];
      await cart.save({ session });
    });

    return order;
  } finally {
    session.endSession();
  }
};
import { createOrderService } from "../services/order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id; 

    const order = await createOrderService(userId);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error); 
  }
};
import {
  createOrderService,
  getMyOrdersService,
  getAllOrdersService,
  updateOrderStatusService,
} from "../services/order.service.js";

export const createOrder = async (req, res, next) => {
  try {
    
    const userId = req.user.userId;
    const { shippingAddress } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address (fullName, email, address, city, postalCode) is required",
      });
    }

    const order = await createOrderService(userId, shippingAddress);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};


export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const orders = await getMyOrdersService(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};


export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const orders = await getAllOrdersService({ status, page: Number(page), limit: Number(limit) });
    res.status(200).json({ success: true, ...orders });
  } catch (error) {
    next(error);
  }
};


export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const order = await updateOrderStatusService(id, status);
    res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    next(error);
  }
};
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const deliveryFee = 25;

export const createOrder = async (req, res) => {
  try {
    const { items, address, phone, notes, payment, name } = req.body;

    let subtotal = 0;

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      subtotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const total = subtotal + deliveryFee;

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      address,
      phone,
      name,
      notes,
      payment,
      subtotal,
      deliveryFee,
      total,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

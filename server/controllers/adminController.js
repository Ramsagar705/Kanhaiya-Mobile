const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getAdminStats = async (req, res) => {
  try {
    const [users, products, orders, paidOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find({ paymentStatus: 'paid' }).select('totalAmount'),
    ]);

    const revenue = paidOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.json({
      success: true,
      stats: { users, products, orders, revenue },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('items.product')
      .sort('-createdAt');

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) {
      order.orderStatus = status;
      order.statusHistory.push({
        status,
        note: note || `Status updated to ${status}`,
      });
    }

    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

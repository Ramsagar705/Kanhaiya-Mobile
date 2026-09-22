const Order = require('../models/Order');
const Product = require('../models/Product');
const crypto = require('crypto');

const buildOrderFromItems = async (items) => {
  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.active) {
      throw new Error('One or more products are unavailable');
    }
    if (product.stock < item.quantity) {
      throw new Error(`Product ${product.title} is out of stock`);
    }

    product.stock -= item.quantity;
    await product.save();

    orderItems.push({
      product: product._id,
      title: product.title,
      price: product.price,
      quantity: item.quantity,
    });
    totalAmount += product.price * item.quantity;
  }

  return { orderItems, totalAmount };
};

exports.placeOrder = async (req, res) => {
  const {
    items,
    shippingAddress,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment verification failed' });
  }

  try {
    const { orderItems, totalAmount } = await buildOrderFromItems(items);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      orderStatus: 'confirmed',
      statusHistory: [{ status: 'confirmed', note: 'Order placed successfully' }],
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.placeCodOrder = async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Order items are required' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address is required' });
  }

  try {
    const { orderItems, totalAmount } = await buildOrderFromItems(items);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount,
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      statusHistory: [{ status: 'confirmed', note: 'Cash on delivery order placed' }],
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort('-createdAt');

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

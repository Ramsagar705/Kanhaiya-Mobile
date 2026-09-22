const User = require('../models/User');

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const productId = req.body.productId || req.body.product;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user.wishlist.some((id) => id.toString() === productId.toString())) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.id
    );
    await user.save();
    await user.populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

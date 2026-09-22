const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

const parseJsonField = (value, fallback = {}) => {
  if (!value) return fallback;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const result = await cloudinary.uploader.upload(
    `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
    {
      folder: 'mobishop/products',
      resource_type: 'image',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

exports.createProduct = async (req, res) => {
  try {
    const files = req.files || [];

    if (files.length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least 5 product photos to upload.',
      });
    }

    const productData = {
      title: req.body.title,
      brand: req.body.brand,
      model: req.body.model,
      type: req.body.type,
      price: Number(req.body.price),
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : Number(req.body.price),
      discount: Number(req.body.discount || 0),
      stock: Number(req.body.stock || 1),
      warranty: req.body.warranty || '12 months warranty',
      description: req.body.description,
      specifications: parseJsonField(req.body.specifications, {}),
      featured: String(req.body.featured).toLowerCase() === 'true',
      active: true,
    };

    if (req.body.type === 'second_hand') {
      productData.condition = parseJsonField(req.body.condition, {});

      if (!productData.condition?.grade) {
        return res.status(400).json({
          success: false,
          message: 'Condition grade is required for second-hand phones',
        });
      }
    }

    const uploadedImages = await Promise.all(files.map(uploadImageToCloudinary));
    productData.image = uploadedImages[0].url;
    productData.imagePublicId = uploadedImages[0].publicId;
    productData.images = uploadedImages.map((uploadedImage) => uploadedImage.url);

    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    if (req.file) {
      try {
        await cloudinary.uploader.destroy(req.file.filename || req.file.originalname, { invalidate: true });
      } catch (cleanupError) {
        console.error('Cloudinary cleanup failed:', cleanupError.message);
      }
    }

    return res.status(400).json({
      success: false,
      message: error.message || 'Product creation failed',
    });
  }
};

exports.addProduct = exports.createProduct;

exports.getProducts = async (req, res) => {
  try {
    const { type, brand, sort } = req.query;
    const query = { active: true };

    if (type) query.type = type;
    if (brand) query.brand = brand;

    let products = Product.find(query);

    if (sort === 'price_low') products = products.sort('price');
    else if (sort === 'price_high') products = products.sort('-price');
    else products = products.sort('-createdAt');

    const result = await products;
    res.json({ success: true, count: result.length, products: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.active) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = {
      title: req.body.title || product.title,
      brand: req.body.brand || product.brand,
      model: req.body.model || product.model,
      type: req.body.type || product.type,
      price: req.body.price ? Number(req.body.price) : product.price,
      originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : product.originalPrice,
      discount: req.body.discount !== undefined ? Number(req.body.discount) : product.discount,
      stock: req.body.stock ? Number(req.body.stock) : product.stock,
      warranty: req.body.warranty || product.warranty,
      description: req.body.description || product.description,
      specifications: parseJsonField(req.body.specifications, product.specifications || {}),
      featured: req.body.featured !== undefined ? String(req.body.featured).toLowerCase() === 'true' : product.featured,
    };

    if (req.body.type === 'second_hand') {
      updateData.condition = parseJsonField(req.body.condition, product.condition || {});
    }

    const files = req.files || [];

    if (files.length) {
      const uploadedImages = await Promise.all(files.map(uploadImageToCloudinary));

      if (product.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(product.imagePublicId, { invalidate: true });
        } catch (deleteError) {
          console.error('Cloudinary delete failed:', deleteError.message);
        }
      }

      updateData.image = uploadedImages[0].url;
      updateData.imagePublicId = uploadedImages[0].publicId;
      updateData.images = uploadedImages.map((uploadedImage) => uploadedImage.url);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Product update failed',
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

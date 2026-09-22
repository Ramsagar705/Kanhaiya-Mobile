const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ['new', 'second_hand'], required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  warranty: { type: String, default: '12 months warranty' },
  image: { type: String },
  imagePublicId: { type: String },
  images: [{ type: String }],
  description: { type: String, required: true },
  specifications: {
    ram: String,
    storage: String,
    processor: String,
    display: String,
    battery: String,
    camera: String,
    os: String,
    color: String,
    is5G: { type: Boolean, default: false },
    sim: String
  },
  // Second-hand specific fields
  condition: {
    grade: { type: String, enum: ['Like New', 'Excellent', 'Good', 'Fair'] },
    batteryHealth: String,
    screenCondition: String,
    bodyCondition: String,
    repairHistory: String,
    imeiVerified: { type: Boolean, default: false }
  },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
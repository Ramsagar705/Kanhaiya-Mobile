const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    slides: [
      {
        image: { type: String, required: true, trim: true },
        title: { type: String, default: '' },
        subtitle: { type: String, default: '' },
        link: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);

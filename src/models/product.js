const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  sku: String,
  additionalCost: Number,
  stockCount: Number,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  variants: [variantSchema],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
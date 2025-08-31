const mongoose = require('mongoose');

// Define Products schema
const productSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  name: {
    type: String
  },
  description: {
    type: String,
  },
  product_details: {
    type: String,
  },
  seller_name: {
    type: String,
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number
  },
  img_url:
  {
    type: String,
  }
  ,
  rating_count: {
    type: Number,
    default: 0
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create Products model
const Products = mongoose.model('products', productSchema);

module.exports = Products;

const mongoose = require('mongoose');

// Define Cart schema
const cartSchema = new mongoose.Schema({
  customer_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  seller_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',

  },
  status: {
    type: String,
    default: 'pending'//pending : if any user add product in cart, paid : payment is done
  },
  price: {
    type: Number
  },
  isCrypto: {
    type: Boolean,
    default: false
  },
  tax: {
    type: Number
  },
  quantity: {
    type: Number
  },
  tax: {
    type: Number
  },
  professional_product_fee: {
    type: Number,
    default: process.env.professional_product_fee
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create Cart model
const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;

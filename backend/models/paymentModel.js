const mongoose = require('mongoose');

// Define Payment schema
const PaymentSchema = new mongoose.Schema({
  payment_id: {
    type: String
  },
  receipt_url: {
    type: String
  },

  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'booking_service',
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'cart',
  },
  type:{
    type:String
  },
  price: {
    type:Number//'video','img
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create Payment model
const Payment = mongoose.model('payment', PaymentSchema);

module.exports = Payment;

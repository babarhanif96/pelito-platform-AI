const mongoose = require('mongoose');

// Define the schema for the shippingAddress table
const shippingAddressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  phone_number: { type: String },
  address_line1: { type: String },
  address_line2: { type: String },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip_code: {
    type: String
  },
  pin_code: {
    type: String
  },
  country: {
    type: String
  },

  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create the Enthusiast_Users model
const ShippingAddress = mongoose.model('shipping_address', shippingAddressSchema);

module.exports = ShippingAddress;

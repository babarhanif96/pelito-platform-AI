const mongoose = require('mongoose');

// Define the schema for the StripeSellerAccount table
// Define the schema for the StripeSellerAccount table
const stripeSellerAccountSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  account_id:{
     type: String
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create the Enthusiast_Users model
const StripeSellerAccount = mongoose.model('stripe_seller_account', stripeSellerAccountSchema);

module.exports = StripeSellerAccount;

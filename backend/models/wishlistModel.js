const mongoose = require('mongoose');

// Define Wishlist schema
const WishlistSchema = new mongoose.Schema({
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
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});
// Create Wishlist model
const Wishlist = mongoose.model('wishlist', WishlistSchema);

module.exports = Wishlist;

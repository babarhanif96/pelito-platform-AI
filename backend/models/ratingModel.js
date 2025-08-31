const mongoose = require('mongoose');

// Define Rating schema
const ratingSchema = new mongoose.Schema({
  salon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
  },
  rating:{
    type:Number//limit 1-5
  },
  type:{
    type:String//product,salon,member
  },
  text:{
    type:String
  },
  update_date: { type: Date, default: Date.now },
  create_date: { type: Date, default: Date.now }
});

// Create Rating model
const Rating = mongoose.model('rating', ratingSchema);

module.exports = Rating;

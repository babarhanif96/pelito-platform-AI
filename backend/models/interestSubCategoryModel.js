const mongoose = require('mongoose');

// Define the schema for the interestSubCategory table
const interestSubCategoryScema = new mongoose.Schema({
  name: { type: String },
  image: { type: String},
  category_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'interest_category',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active', // Set a default value if needed
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create the interestSubCategory model
const InterestSubCategory = mongoose.model('interest_sub_category', interestSubCategoryScema);
module.exports = InterestSubCategory;

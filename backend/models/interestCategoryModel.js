const mongoose = require('mongoose');

// Define the schema for the interestCategory table
const interestCategoryScema = new mongoose.Schema({
  name: { type: String },
  image: { type: String},
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active', // Set a default value if needed
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create the interestCategory model
const InterestCategory = mongoose.model('interest_category', interestCategoryScema);

module.exports = InterestCategory;

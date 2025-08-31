const mongoose = require('mongoose');

// Define Likes schema
const userInterestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  categories: [
    {
      category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
      },
      subcategories: [
        {
          subcategory_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sub_category',
          },
        },
      ],
    },
  ],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create Likes model
const UserInterest = mongoose.model('user_interest', userInterestSchema);

module.exports = UserInterest;

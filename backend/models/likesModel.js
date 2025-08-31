const mongoose = require('mongoose');

// Define Likes schema
const likeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
  },
  update_date: { type: Date, default: Date.now },
  create_date: { type: Date, default: Date.now }
});

// Create Likes model
const Likes = mongoose.model('likes', likeSchema);

module.exports = Likes;

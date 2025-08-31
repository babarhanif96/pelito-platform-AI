const mongoose = require('mongoose');

// Define Posts schema
const postSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  caption: {
    type: String
  },

  isReported: {
    type: Boolean,
    default: false
  },

  image_url: [{
    type: String//'video','img
  }],
  video_url: [{
    type: String//'video','img
  }],
  likes_count: {
    type: Number,
    default: 0
  },
  comments_count: {
    type: Number,
    default: 0
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create Posts model
const Posts = mongoose.model('posts', postSchema);

module.exports = Posts;

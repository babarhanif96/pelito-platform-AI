const mongoose = require('mongoose');

// Define Followers schema
const followerSchema = new mongoose.Schema({
  follower_id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  },
  follower_count: {
    type: Number
  }
});

// Create Followers model
const Followers = mongoose.model('followers', followerSchema);

module.exports = Followers;

Stories

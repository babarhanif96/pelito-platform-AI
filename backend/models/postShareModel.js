const mongoose = require('mongoose');

// Define the schema for the Post_Share table
const postShareSchema = new mongoose.Schema({
  post_share_id: { type: Number, required: true, unique: true },
  post_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  share_date: { type: Date, default: Date.now }
});

// Create the Post_Share model
const PostShare = mongoose.model('post_share', postShareSchema);

module.exports = PostShare;

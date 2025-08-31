const mongoose = require('mongoose');

// Define the schema for the Post_Hashtags table
const postHashtagsSchema = new mongoose.Schema({
  post_Hashtag_ID: { type: Number, required: true, unique: true },
  post_ID: { type: Number, required: true },
  hashtag_ID: { type: Number, required: true }
});

// Create the Post_Hashtags model
const PostHashtags = mongoose.model('post_hashtag', postHashtagsSchema);

module.exports = PostHashtags;

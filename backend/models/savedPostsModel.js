const mongoose = require('mongoose');

// Define the schema for the Saved_Posts table
const savedPostsSchema = new mongoose.Schema({
  saved_post_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  post_id: { type: Number, required: true },
  save_date: { type: Date, default: Date.now }
});

// Create the Saved_Posts model
const SavedPosts = mongoose.model('Saved_Post', savedPostsSchema);

module.exports = SavedPosts;

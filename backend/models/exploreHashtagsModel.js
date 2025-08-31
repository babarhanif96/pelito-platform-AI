const mongoose = require('mongoose');

// Define the schema for the Explore_Hashtags table
const exploreHashtagsSchema = new mongoose.Schema({
  explore_hashtag_id: { type: Number, required: true, unique: true },
  content_id: { type: Number, required: true },
  hashtag_id: { type: Number, required: true }
});

// Create the Explore_Hashtags model
const ExploreHashtags = mongoose.model('explore_hashtag', exploreHashtagsSchema);

module.exports = ExploreHashtags;

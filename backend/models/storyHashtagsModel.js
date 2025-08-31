const mongoose = require('mongoose');

// Define the schema for the Story_Hashtags table
const storyHashtagsSchema = new mongoose.Schema({
  story_hashtag_id: { type: Number, required: true, unique: true },
  story_id: { type: Number, required: true },
  hashtag_id: { type: Number, required: true }
});

// Create the Story_Hashtags model
const StoryHashtags = mongoose.model('story_hashtag', storyHashtagsSchema);

module.exports = StoryHashtags;

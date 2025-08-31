const mongoose = require('mongoose');

// Define Story_Views schema
const storyViewSchema = new mongoose.Schema({
  hashtag_id: {
    type: Number,
    required: true,
    unique: true
  },
  hashtag_name: {
    type: String,
    required: true
  },
});

// Create Story_Views model
const StoryViews = mongoose.model('story_views', storyViewSchema);

module.exports = StoryViews;

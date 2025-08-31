const mongoose = require('mongoose');

// Define Story_Views schema
const storyViewSchema = new mongoose.Schema({
  story_view_id: {
    type: Number,
    required: true,
    unique: true
  },
  story_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  view_date: {
    type: Date
  }
});

// Create Story_Views model
const StoryViews = mongoose.model('story_views', storyViewSchema);

module.exports = StoryViews;

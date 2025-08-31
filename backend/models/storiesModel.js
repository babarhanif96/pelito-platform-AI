const mongoose = require('mongoose');

// Define Stories schema
const storySchema = new mongoose.Schema({
  story_id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  },
  story_content: {
    type: String
  },
  date_created: {
    type: Date
  }
});

// Create Stories model
const Stories = mongoose.model('stories', storySchema);

module.exports = Stories;

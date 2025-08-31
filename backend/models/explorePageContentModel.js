const mongoose = require('mongoose');

// Define the schema for the Explore_Page_Content table
const explorePageContentSchema = new mongoose.Schema({
  content_id: { type: Number, required: true, unique: true },
  content_type: { type: String, required: true },
  content_text: { type: String },
  date_posted: { type: Date, default: Date.now }
});

// Create the Explore_Page_Content model
const ExplorePageContent = mongoose.model('explore_page_content', explorePageContentSchema);

module.exports = ExplorePageContent;

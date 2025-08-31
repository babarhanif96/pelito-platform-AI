const mongoose = require('mongoose');

// Define the schema for the Explore_Page_Views table
const explorePageViewsSchema = new mongoose.Schema({
  explore_page_view_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  content_id: { type: Number, required: true },
  view_date: { type: Date, default: Date.now }
});

// Create the Explore_Page_Views model
const ExplorePageViews = mongoose.model('explore_page_view', explorePageViewsSchema);

module.exports = ExplorePageViews;

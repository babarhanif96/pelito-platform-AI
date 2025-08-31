const mongoose = require('mongoose');

// Define the schema for the Ad_Views table
const adViewsSchema = new mongoose.Schema({
  ad_view_id: { type: Number, required: true, unique: true },
  ad_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  view_date: { type: Date, default: Date.now }
});

// Create the Ad_Views model
const AdViews = mongoose.model('Ad_View', adViewsSchema);

module.exports = AdViews;

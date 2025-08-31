const mongoose = require('mongoose');

// Define the schema for the Search_History table
const searchHistorySchema = new mongoose.Schema({
  search_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  search_query: { type: String },
  search_date: { type: Date, default: Date.now }
});

// Create the Search_History model
const SearchHistory = mongoose.model('Search_History', searchHistorySchema);

module.exports = SearchHistory;

const mongoose = require('mongoose');

// Define the schema for the Reported_Posts table
const reportedPostsSchema = new mongoose.Schema({
  report_id: { type: Number, required: true, unique: true },
  post_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  report_reason: { type: String },
  report_date: { type: Date, default: Date.now }
});

// Create the Reported_Posts model
const ReportedPosts = mongoose.model('reported_post', reportedPostsSchema);

module.exports = ReportedPosts;

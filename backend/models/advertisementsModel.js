const mongoose = require('mongoose');

// Define the schema for the Advertisements table
const advertisementsSchema = new mongoose.Schema({
  ad_id: { type: Number, required: true, unique: true },
  ad_content: { type: String },
  ad_image_url: { type: String, maxlength: 200 },
  ad_link: { type: String, maxlength: 200 },
  date_posted: { type: Date, default: Date.now }
});

// Create the Advertisements model
const Advertisements = mongoose.model('Advertisement', advertisementsSchema);

module.exports = Advertisements;

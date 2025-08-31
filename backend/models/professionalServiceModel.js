const mongoose = require('mongoose');

// Define the schema for the Service table
const professionalServiceSchema = new mongoose.Schema({
  image_urls: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  service_name: {
    type: String,
  },
  description: {
    type: String,
  },
  profile_picture: {
    type: String,
  },
  price: {
    type: Number,
  },
  period: {
    type: String,
  },
  hashtag: [{
    type: String,
  }],
  update_date: { type: Date, default: Date.now },
  create_date: { type: Date, default: Date.now }
});

// Create the Service model
const ProfessionalService = mongoose.model('professional_service', professionalServiceSchema);

module.exports = ProfessionalService;

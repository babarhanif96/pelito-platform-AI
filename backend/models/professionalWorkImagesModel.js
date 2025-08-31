const mongoose = require('mongoose');

// Define the schema for the Images table
const professionalWorkImagesSchema = new mongoose.Schema({
  image_urls: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  priority:{
    type:Number
  },
  caption:{
    type:String
  },
  update_date: { type: Date, default: Date.now },
  create_date: { type: Date, default: Date.now }
});

// Create the Images model
const ProfessionalWorkImages = mongoose.model('professional_work_images', professionalWorkImagesSchema);

module.exports = ProfessionalWorkImages;

const mongoose = require('mongoose');

// Define professionalWorkingHourSchema schema
const professionalWorkingHourSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  day: {
    type:String
  },
  time: {
    type:String
  },
  on_off:{
    type:String
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create professionalWorkingHours model
const ProfessionalWorkingHours = mongoose.model('professional_working_hours', professionalWorkingHourSchema);

module.exports = ProfessionalWorkingHours;

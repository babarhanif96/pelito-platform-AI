const mongoose = require('mongoose');

// Define Inquiry schema
const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String
  },
  subject_type: {
    type: String
  },
  msg: {
    type:String//'video','img
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create Inquiry model
const Inquiry = mongoose.model('Inquiry', InquirySchema);

module.exports = Inquiry;

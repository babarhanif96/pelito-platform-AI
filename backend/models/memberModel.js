const mongoose = require('mongoose');

// Define Member schema
const memberSchema = new mongoose.Schema({
  salon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  profile_picture: {
    type: String
  },
  contact_no: {
    type: String
  },
  email: {
    type: String
  },
  job_title: {
    type: String
  },

  unavailable_dates: {
    type: [Date]
  },

  capacity: {
    type: Number
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create Member model
const Member = mongoose.model('member', memberSchema);

module.exports = Member;

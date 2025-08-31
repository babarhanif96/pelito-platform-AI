const mongoose = require('mongoose');

// Define ProfessionalUsers schema
const professionalUserSchema = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone_number: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zip_code: {
    type: String
  },
  country: {
    type: String
  },
  membership_type: {
    type: String
  },
  credit_count: {
    type: Number
  },
  appointment_count: {
    type: Number
  },
  specializations: {
    type: String
  },
  portfolio_link: {
    type: String
  },
  rating: {
    type: Number
  },
  experience: {
    type: Number
  },
  certification: {
    type: String
  },
  profile_picture: {
    type: String
  },
  account_status: {
    type: String
  }
});

// Create ProfessionalUsers model
const ProfessionalUsers = mongoose.model('professional_users', professionalUserSchema);

module.exports = ProfessionalUsers;

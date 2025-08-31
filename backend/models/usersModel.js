const mongoose = require('mongoose');

// Define the schema for the Enthusiast_Users table
const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, default: 'not exist' },
  password: { type: String },
  phone_number: { type: String },
  address_line1: { type: String },
  address_line2: { type: String },
  pincode: { type: String },
  membership_type: { type: String },
  credit_count: { type: Number },
  subscription_type: { type: String },
  profile_picture: { type: String },
  account_status: { type: String },
  googleId: { type: String },
  facebookId: { type: String },
  instaId: { type: String },
  username: { type: String },
  appleId: { type: String },
  address: {
    type: String
  },
  IsStripeEnabled: {
    type: Boolean,
    default: false
  },
  IsAirdropClaimed: {
    type: Boolean,
    default: false
  },
  IsStripeConnected: {
    type: Boolean,
    default: false
  },
  address: {
    type: String
  },
  description: {
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
  },
  interest_status: {
    type: Boolean,
    default: false
  },
  salon_name: {
    type: String
  },
  user_type: {
    type: String,
    required: true,
    enum: ['admin', 'enthusiastic', 'professional'],
    default: 'enthusiastic'
  },
  location: {
    type: {
      type: String, // 'Point' is the type for representing a location
      enum: ['Point'], // Only 'Point' is allowed as a type
      // required: true,
    },
    coordinates: {
      type: [Number], // Array of two numbers [longitude, latitude]
      // required: true,
    },
  },
  slot_type_for_enthu: {
    type: String//basic & advance
  },
  account_status: {
    type: String
  },
  profile_name: {
    type: String
  },
  otp: {
    type: String
  },
  address: {
    type: String
  },
  privateKey: {
    type: String
  },
  cover_pic: {
    type: String
  },
  forgot_otp: {
    type: String
  },
  offDays: {
    type: [String],
    default: []
  },
  email_verify: {
    type: Boolean,
    default: false
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  booking_user_type: {
    type: String,
    default: 'online'
  },
  cancellation_policy: {
    type: String
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },

  loggedAt: { type: Date },

});

// Create the Enthusiast_Users model
const User = mongoose.model('user', userSchema);

module.exports = User;

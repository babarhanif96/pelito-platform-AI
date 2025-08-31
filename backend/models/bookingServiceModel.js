const mongoose = require('mongoose');

// Define bookingService schema
const bookingServiceSchema = new mongoose.Schema({
  booking_id: {
    type: String
  },
  customer_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  appointment_ref: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  seller_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  service_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'professional_service',
  },
  slot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'slot',
  },
  orignal_price: {
    type: Number
  },
  total_amount: {
    type: Number
  },
  tax: {
    type: Number
  },
  professional_service_fee: {
    type: Number,
    default: process.env.professional_service_fee
  },
  other_charges: {
    type: Number
  },
  day: {
    type: Date
  },
  time: {
    type: String
  },
  status: {
    type: String,
    default: 'pending'//pending: inital state, ccccc
  },
  booking_time: {
    type: String,
  },
  canceled_by: {
    type: String,
  },
  recurring_status: {
    type: Boolean,
  },
  recurring_type: {
    type: String,// weekly, monthly
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
  },
  payment_mode: {
    type: String,//online, offline
    default: 'online'
  },
  card_no: {
    type: String,
  },
  isCrypto: {
    type: Boolean,
    default: false
  },
  cv: {
    type: String,
  },
  exp_month: {
    type: String,
  },
  exp_year: {
    type: String
  },
  slot_date: { type: Date },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create BookingService model
const BookingService = mongoose.model('booking_service', bookingServiceSchema);

module.exports = BookingService;

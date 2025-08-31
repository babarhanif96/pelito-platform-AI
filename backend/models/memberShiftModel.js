const mongoose = require('mongoose');

// Define MemberShift schema
const memberShiftSchema = new mongoose.Schema({
  salon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
  },
  shift_day: {
    type: String,
  },
  start_time: {
    type:String
  },
  end_time: {
    type:String
  },
  on_off:{
    type: String,
  },
  closed_day:{
    type: String,
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create MemberShift model
const MemberShift = mongoose.model('member_shift', memberShiftSchema);

module.exports = MemberShift;

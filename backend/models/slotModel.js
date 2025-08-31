const mongoose = require('mongoose');

// Define slot schema
const slotSchema = new mongoose.Schema({
  salon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
  },
  slot_day: {
    type: String,
  },
  start_time: {
    type:String
  },
  end_time: {
    type:String
  },
  slot_Date: { type: Date },
  on_off: {
    type:String//on//off
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create slot model
const Slot = mongoose.model('slot', slotSchema);

module.exports = Slot;

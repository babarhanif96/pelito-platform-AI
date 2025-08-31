const mongoose = require('mongoose');

// Define memberBreakTime schema
const memberBreakTimeSchema = new mongoose.Schema({
  salon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'member',
  },
  slot_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'slot',
  },
  start_time: {
    type:String
  },
  end_time: {
    type:String
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create MemberBreakTime model
const MemberBreakTime = mongoose.model('member_break_time', memberBreakTimeSchema);

module.exports = MemberBreakTime;

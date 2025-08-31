const mongoose = require('mongoose');

// Define Invite schema
const InviteSchema = new mongoose.Schema({
  email_array:[{
    type:String
  }],
  seller_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  subject: {
    type: String,
  },
  body: {
    type: String,
  },
  body_html: {
    type: String,
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});
// Create Invite model
const Invite = mongoose.model('invite', InviteSchema);

module.exports = Invite;

const mongoose = require('mongoose');

// Define the schema for the Direct_Messages table
const directMessagesSchema = new mongoose.Schema({
  message_id: { type: Number, required: true, unique: true },
  sender_id: { type: Number, required: true },
  receiver_id: { type: Number, required: true },
  message_text: { type: String },
  date_sent: { type: Date, default: Date.now }
});

// Create the Direct_Messages model
const DirectMessages = mongoose.model('Direct_Message', directMessagesSchema);

module.exports = DirectMessages;

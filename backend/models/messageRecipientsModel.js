const mongoose = require('mongoose');

// Define the schema for the Message_Recipients table
const messageRecipientsSchema = new mongoose.Schema({
  message_recipient_id: { type: Number, required: true, unique: true },
  message_id: { type: Number, required: true },
  receiver_id: { type: Number, required: true }
});

// Create the Message_Recipients model
const MessageRecipients = mongoose.model('message_recipient', messageRecipientsSchema);

module.exports = MessageRecipients;

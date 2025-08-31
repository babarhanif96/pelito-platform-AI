const mongoose = require('mongoose');

// Define the schema for the Notifications table
const notificationsSchema = new mongoose.Schema({
  notification_id: { type: Number, required: true, unique: true },
  user_id: { type: Number, required: true },
  notification_text: { type: String },
  notification_date: { type: Date, default: Date.now },
  is_read: { type: Boolean, default: false }
});

// Create the Notifications model
const Notifications = mongoose.model('Notification', notificationsSchema);

module.exports = Notifications;

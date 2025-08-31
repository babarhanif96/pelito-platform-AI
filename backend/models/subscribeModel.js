const mongoose = require('mongoose');

// Define Subscribe schema
const subscribeSchema = new mongoose.Schema({
  email: {
    type: String
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

// Create Subscribe model
const Subscribe = mongoose.model('subscribe', subscribeSchema);

module.exports = Subscribe;

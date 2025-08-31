const mongoose = require('mongoose');

// Define the schema for the Reactions table
const reactionsSchema = new mongoose.Schema({
  reaction_id: { type: Number, required: true, unique: true },
  post_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  reaction_type: { type: String, maxlength: 20 },
  reaction_date: { type: Date, default: Date.now }
});

// Create the Reactions model
const Reactions = mongoose.model('reaction', reactionsSchema);

module.exports = Reactions;

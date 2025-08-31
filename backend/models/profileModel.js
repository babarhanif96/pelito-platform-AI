const mongoose = require('mongoose');

// Define Profiles schema
const profileSchema = new mongoose.Schema({
  profile_id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  },
  bio: {
    type: String
  },
  date_of_birth: {
    type: Date
  },
  gender: {
    type: String,
    maxlength: 10
  },
  profile_picture: {
    type: String,
    maxlength: 200
  }
});

// Create Profiles model
const Profiles = mongoose.model('profiles', profileSchema);

module.exports = Profiles;

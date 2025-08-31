const mongoose = require('mongoose');

// Define Comments schema
const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'posts',
  },
  comment_text: {
    type: String
  },
  update_date: { type: Date, default: Date.now },
  create_date: { type: Date, default: Date.now }
});

// Create Comments model
const Comments = mongoose.model('comments', commentSchema);

module.exports = Comments;

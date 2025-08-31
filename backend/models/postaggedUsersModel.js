const mongoose = require('mongoose');

// Define the schema for the Post_Tagged_Users table
const postTaggedUsersSchema = new mongoose.Schema({
  post_tag_id: { type: Number, required: true, unique: true },
  post_id: { type: Number, required: true },
  user_id: { type: Number, required: true }
});

// Create the Post_Tagged_Users model
const PostTaggedUsers = mongoose.model('post_tagged_user', postTaggedUsersSchema);

module.exports = PostTaggedUsers;

const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
  faceEmbeddings: {
    type: String,
    required: true,
  },
  profileAvatar: {
    type: String,
    default: ""
  }
});


const User = mongoose.model('User', userSchema);
module.exports = User;
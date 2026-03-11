const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  bio: { type: String },
  about: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  isBlocked: { type: Boolean, default: false },
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
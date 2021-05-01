const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokenId: { type: String, required: false },
  verificationToken: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ['Verified', 'Created'],
    default: 'Created',
  },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

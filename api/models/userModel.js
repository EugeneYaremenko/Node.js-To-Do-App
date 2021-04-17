const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
  verificationToken: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ['Verified', 'Created'],
    default: 'Created',
  },
});

userSchema.statics.verifyUser = verifyUser;
userSchema.statics.updateToken = updateToken;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.createVerificationToken = createVerificationToken;
userSchema.statics.findByVerificationToken = findByVerificationToken;

async function verifyUser(userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      status: 'Verified',
      verificationToken: null,
    },
    { new: true }
  );
}

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

async function createVerificationToken(userId, verificationToken) {
  return this.findByIdAndUpdate(
    userId,
    {
      verificationToken,
    },
    {
      new: true,
    }
  );
}

async function findByVerificationToken(verificationToken) {
  return this.findOne({
    verificationToken,
  });
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

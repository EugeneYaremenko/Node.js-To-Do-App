const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteShema = new Schema({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const noteModel = mongoose.model('Notes', noteShema);

module.exports = noteModel;

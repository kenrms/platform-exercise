const mongoose = require('mongoose');

const { Schema } = mongoose;

const userModel = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String }
    // TODO other fields
  }
);

module.exports = mongoose.model('User', userModel);

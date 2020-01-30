const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const userModel = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String }
    // TODO other fields
  }
);

userModel.pre('save', function preUserSave(next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  // Hash the dang password
  return bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) {
      return next(err);
    }

    user.password = hash;
    return next();
  });
});

module.exports = mongoose.model('User', userModel);

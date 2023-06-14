const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  }
})

const User = mongoose.model('User', userSchema, 'users');

module.exports = User
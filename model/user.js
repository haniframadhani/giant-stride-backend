const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  refresh_token: {
    type: String
  }
})

const User = mongoose.model('User', userSchema, 'users');

module.exports = User
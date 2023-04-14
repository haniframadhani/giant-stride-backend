const mongoose = require('mongoose');
const Blog = mongoose.model('Blog', {
  image: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  body: {
    type: String,
    require: true
  }
})

module.exports = Blog
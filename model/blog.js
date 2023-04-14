const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
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
}, {
  timestamps: {
    createdAt: 'uploadDate',
    updatedAt: false
  }
})
const Blog = mongoose.model('Blog', blogSchema, 'blogs')

module.exports = Blog
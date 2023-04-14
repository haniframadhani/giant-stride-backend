const express = require('express')
const app = express()

require("dotenv").config();

require('./utils/db');
const Blog = require('./model/blog');

const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Giant Stride')
})

app.get('/api/article', async (req, res) => {
  const id = req.query.id;
  if (id) {
    try {
      const articles = await Blog.findOne({
        _id: id
      })
      return res.status(200).json({
        status: 200,
        message: 'succeed get article data',
        articles
      })
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Failed to get article data',
        error
      })
    }
  }
  try {
    const articles = await Blog.find()
    return res.status(200).json({
      status: 200,
      message: 'succeed get article data',
      articles
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Failed to get article data',
      error
    })
  }
})

app.listen(port, () => {
  console.log(`running on http://localhost:${port}/`)
})
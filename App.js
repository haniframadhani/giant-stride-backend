const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

require('./utils/db');
const storage = require('./model/storage');
const Blog = require('./model/blog');
const { unlink } = require('fs');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Giant Stride')
})

app.get('/api/article', async (req, res) => {
  const id = req.query.id;
  if (id) {
    try {
      const article = await Blog.findOne({
        _id: id
      })
      return res.status(200).json({
        status: 200,
        message: 'succeed get article data',
        article
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
    const articles = await Blog.find().sort({
      "uploadDate": -1
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
})

app.post("/api/article", upload.single('image'), async (req, res) => {
  let finalImageURL = req.protocol + "://" + req.get("host") + "/img/" + req.file.filename;
  req.body.image = finalImageURL;
  if (!Object.keys(req.body).length) {
    return res.status(400).json({
      status: 400,
      message: "no data send",
    });
  }
  const { title, image, body } = req.body;
  if (!title || !image || !body) {
    if (!title) {
      return res.status(400).json({
        status: 400,
        message: 'title is empty'
      })
    }
    if (!image) {
      return res.status(400).json({
        status: 400,
        message: 'image is empty'
      })
    }
    if (!body) {
      return res.status(400).json({
        status: 400,
        message: 'body is empty'
      })
    }
  }
  try {
    const article = await Blog.insertMany(req.body);
    return res.status(201).json({
      status: 201,
      message: 'Successfully uploaded article',
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Failed to upload article',
      error
    })
  }
})

app.delete("/api/article", async (req, res) => {
  const id = req.query.id;
  let img = null;
  try {
    const article = await Blog.findOne({ _id: id });
    if (article === null) {
      return res.status(404).json({
        status: 404,
        message: 'article not found',
      })
    }
    img = article.image;
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'internal server error',
    })
  }
  img = img.split(req.protocol + "://" + req.get("host") + '/').join('')
  try {
    const article = await Blog.findByIdAndRemove({ _id: id });
    unlink(`public/${img}`, err => {
      if (err) throw err;
    })
    return res.status(200).json({
      status: 200,
      message: 'success delete article'
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'internal server error',
    })
  }
})

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      status: 400,
      message: 'Error uploading image'
    });
  } else if (err) {
    res.status(500).json({
      status: 500,
      message: 'Internal server error'
    });
  } else {
    next();
  }
})

app.listen(port, () => {
  console.log(`running on http://localhost:${port}/`)
})
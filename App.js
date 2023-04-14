const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

require('./utils/db');
const storage = require('./model/storage');
const Blog = require('./model/blog');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.send('Giant Spot')
})

app.post("/api/upload", upload.single('photo'), (req, res) => {
  let finalImageURL = req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
  res.json({ status: "success", image: finalImageURL })
})

app.post("/api/article", (req, res) => {
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
    Blog.insertMany(req.body);
    return res.status(201).json({
      status: 201,
      message: 'Successfully uploaded article',
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      status: 500,
      message: 'Failed to upload article',
      error
    })
  }
})

app.listen(port, () => {
  console.log(`running on http://localhost:${port}/`)
})
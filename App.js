const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
require("dotenv").config();

require('./utils/db');
const storage = require('./model/storage');
const Blog = require('./model/blog');
const User = require('./model/user');
const { unlink } = require('fs');
const VerifyToken = require('./middleware/verifyToken');

const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
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

app.post("/api/article", upload.single('image'), VerifyToken, async (req, res) => {
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

app.delete("/api/article", VerifyToken, async (req, res) => {
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
    return res.status(204).json({
      status: 204,
      message: 'success delete article'
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'internal server error',
    })
  }
})

app.patch("/api/article", VerifyToken, async (req, res) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({
      status: 400,
      message: "no data send",
    });
  }
  const id = req.query.id;
  let oldArticle = null;
  try {
    oldArticle = await Blog.findOne({ _id: id });
    if (oldArticle === null) {
      return res.status(404).json({
        status: 404,
        message: 'article not found',
      })
    }
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'internal server error',
    })
  }
  const { title, body } = req.body;

  // jika data baru sama dengan data lama atau data yang dikirim kosong
  if (title === oldArticle.title && body === oldArticle.body || title == '' && body == '') {
    return res.status(304).send()
  }

  try {
    await Blog.updateOne({ _id: id }, {
      $set: {
        ...(title && { title }),
        ...(body && { body })
      }
    });
  }
  catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'internal server error',
    })
  }
  return res.status(200).json({
    status: 200,
    message: 'article updated'
  })
})

app.get("/api/auth/crypt", async (req, res) => {
  const saltRound = 10;
  const plainText = "test123";
  bcrypt.hash(plainText, saltRound, function (err, hash) {
    // console.log(hash);
    User.insertMany({
      name: "test123",
      email: "test123@test.com",
      password: hash
    })
    return res.status(200).json({
      status: 200,
      message: 'success'
    })
  })
})

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: 'username and password are required'
    })
  }
  let user;
  try {
    user = await User.findOne({
      email: email
    })
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'internal server error'
    })
  }
  if (!user) {
    return res.status(401).json({
      status: 401,
      message: 'username or password are incorrect'
    })
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({
      status: 401,
      message: 'username or password are incorrect'
    })
  }
  const userId = user._id.toString();
  const userName = user.name;
  const userEmail = user.email;
  const accessToken = jwt.sign({ userId, userName, userEmail }, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: '20s',
  })
  const refreshToken = jwt.sign({ userId, userName, userEmail }, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: '1d',
  })
  await User.updateOne({ _id: user._id }, {
    $set: {
      refresh_token: refreshToken
    }
  })
  res.cookie('refreshToken', refreshToken, {
    httpsOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
  return res.status(200).json({
    status: 200,
    message: 'success',
    accessToken
  })
})

app.get("/api/auth/token", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'unauthorized'
      })
    }
    const user = await User.findOne({ refresh_token: refreshToken })
    if (!user) {
      return res.status(403).json({
        status: 403,
        message: 'forbidden'
      })
    }
    jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          message: 'forbidden'
        })
      }
      const userId = user._id.toString();
      const userName = user.name;
      const userEmail = user.email;
      const accessToken = jwt.sign({ userId, userName, userEmail }, `${process.env.ACCESS_TOKEN_SECRET}`, {
        expiresIn: '15s'
      });
      return res.status(200).json({
        status: 200,
        accessToken
      })
    })
  } catch (err) {
    console.log(err);
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
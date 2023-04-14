const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.parse(file.originalname).name.replace(/\s/g, '') + "-" + Date.now() + path.extname(file.originalname)
    );
  }
})

module.exports = storage
const mongoose = require('mongoose');
require("dotenv").config();
const password = process.env.DATABASE_PASSWORD;
const dburl = `mongodb+srv://hanif:${password}@cluster0.tysxa1p.mongodb.net/?retryWrites=true&w=majority`;
try {
  mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('success connect to database')
} catch (err) {
  console.log(err);
  console.log('error to connect to database')
}
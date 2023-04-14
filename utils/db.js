const mongoose = require('mongoose');
require("dotenv").config();
const password = process.env.DATABASE_PASSWORD;
const dburl = `mongodb+srv://hanif:${password}@cluster0.tysxa1p.mongodb.net/giant-stride?retryWrites=true&w=majority`;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
mongoose.connect(dburl, connectionParams)
  .then(() => {
    console.log('Connected to database ')
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  })
const mongoose = require('mongoose');
require("dotenv").config();
const dburl = process.env.DATABASE_URL_CLOUD;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
mongoose.connect(dburl, connectionParams)
  .then(() => console.log('connected to database'))
  .catch(err => console.log(`error connecting to database\n${err}`));
const mongoose = require('mongoose');
require("dotenv").config();
const dburl = process.env.DATABASE_URL_CLOUD;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(dburl, connectionParams)
    console.log('connected to database');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(`failed connecting to database\n${err}`);
    process.exit(1);
  }
}
module.exports = connectDb
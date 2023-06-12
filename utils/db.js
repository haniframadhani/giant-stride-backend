const mongoose = require('mongoose');
require("dotenv").config();
const password = process.env.DATABASE_PASSWORD;
const dburl = `mongodb+srv://hanif:${password}@cluster0.tysxa1p.mongodb.net/giant-stride?retryWrites=true&w=majority`;
const dburllocal = `mongodb://localhost:27017/giant-stride`;
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}
let connection = false;
(async () => {
  while (!connection) {
    try {
      await mongoose.connect(dburl, connectionParams);
      console.log('Connected to database cloud');
      connection = true;
    } catch (err) {
      console.log('failed to connect to database cloud.\ntrying to connect to local');
      try {
        await mongoose.connect(dburllocal, connectionParams);
        console.log('Connected to database local');
        connection = true;
      } catch (err) {
        console.error(`Error connecting to the database. \n${err}`);
      }
    }
  }
})();
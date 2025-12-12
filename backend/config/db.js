// config/db.js
const mongoose = require('mongoose');

function connectDB(mongoURI) {
  return mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = connectDB;

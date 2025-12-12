// models/Search.js
const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  location: { type: String, required: true },
  result: { type: Object, required: true }, // store raw weather or summary
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Search', SearchSchema);

// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB if MONGO_URI provided
if (process.env.MONGO_URI) {
  connectDB(process.env.MONGO_URI).then(() => {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error:', err.message);
  });
}

const weatherRoute = require('./routes/weather');

app.use('/api/weather', weatherRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

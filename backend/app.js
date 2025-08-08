const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/items', require('./routes/items'));
app.use('/api/claims', require('./routes/claims'));
// ... add /users, /admin, /report as needed

app.get('/', (req, res) => res.send('Lost & Found API'));

module.exports = app;

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const testRoutes = require('./routes/testRoutes');
const songRoutes = require('./routes/songRoutes');
const getallsongRoutes = require('./routes/songRoutes');
// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/test',testRoutes)

app.use('/api/songs',songRoutes)

app.use('/uploads', express.static('uploads'));

app.get('/', getallsongRoutes);

// Export the app
module.exports = app;

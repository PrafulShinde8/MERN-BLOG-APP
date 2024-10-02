const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(upload());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Blog App API!');
});

// Handle 404 errors
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

// Connect to MongoDB and start server
connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => console.log
    (`Server running on port ${process.env.PORT}`));
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


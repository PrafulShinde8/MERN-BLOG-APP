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

// CORS configuration
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:3000"; // Fallback to localhost during development
app.use(cors({ credentials: true, origin: frontendOrigin }));

app.use(upload());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Add a root route
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Blog App API!');
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Handle 404 errors
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

// Connect to MongoDB and start server
connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


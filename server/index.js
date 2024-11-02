// const express = require('express');
// const cors = require('cors');
// const { connect } = require('mongoose');
// require('dotenv').config();
// const upload = require('express-fileupload');

// const userRoutes = require('./routes/userRoutes');
// const postRoutes = require('./routes/postRoutes');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware setup
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // CORS setup to allow localhost and the production URL from .env
// const allowedOrigins = [
//   'http://localhost:3000', 
//   process.env.CLIENT_URL 
// ];

// app.use(cors({
//   credentials: true,
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl requests)
//     if (!origin) return callback(null, true);
    
//     // Check if the request's origin is in the allowed list
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// // Set Content Security Policy
// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval'");
//   next();
// });

// app.use(upload());
// app.use('/uploads', express.static(__dirname + '/uploads'));


// app.get('/', (req, res) => {
//   res.send('Welcome to the MERN Blog App API!');
// });

// // Use routes
// app.use('/api/users', userRoutes);
// app.use('/api/posts', postRoutes);

// // Handle 404 errors
// app.use(notFound);

// // Error handler middleware
// app.use(errorHandler);

// // Connect to MongoDB and start server
// connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });

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
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL || 'http://localhost:3000' })); // Update for production
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
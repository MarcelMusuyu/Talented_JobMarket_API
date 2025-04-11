/* eslint-disable no-undef */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const env = require("dotenv").config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const publisherRoutes = require('./routes/publisherRoutes');

// For parsing application/json
app.use(express.json());

app.use(cors({ origin: '*' })); // Enable CORS for all routes

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Removed redundant header setting (cors already handles it)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 **************************/
const port = process.env.PORT;
const host = process.env.HOST;

// Use authRoutes for authentication-related endpoints
app.use('/auth', authRoutes);

// Routes
app.use('/books', bookRoutes);
app.use('/publishers', publisherRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI,
   {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'bookStore' 
   }
)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server listening on ${host} port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

/* eslint-disable no-undef */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const env = require("dotenv").config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger_output.json');
const authRoutes = require('./routes/authRoutes');
const applicationsRoutes = require('./routes/applicationsRoutes');
const recruitmentRoutes = require('./routes/recruitmentRoutes');


// For parsing application/json
app.use(express.json());

app.use(cors({ origin: '*' })); // Enable CORS for all routes

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
 app.use(cors({
      exposedHeaders: ['Authorization'], //  <---  Add this line
}));
// Removed redundant header setting (cors already handles it)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 **************************/
const port = process.env.PORT;
const host = process.env.HOST;

// Use authRoutes for authentication-related endpoints
app.use('/user', authRoutes);

// Routes
app.use('/applications', applicationsRoutes);
app.use('/recruitments', recruitmentRoutes);


// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI,
   {
    dbName: 'jobMarket' 
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

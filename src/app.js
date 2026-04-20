require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const path = require('path');

const app = express();

/* ----------------------
   Body Parser
---------------------- */

// Provide default MAX_FILE_SIZE_MB = 10 if undefined
const maxFileSize = process.env.MAX_FILE_SIZE_MB || 10;

app.use(express.json({ limit: `${maxFileSize}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${maxFileSize}mb` }));

/* ----------------------
   Security Middleware
---------------------- */
app.use(helmet());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});
/* ----------------------
   Logging
---------------------- */
app.use(morgan('combined'));
console.log('junaid aalam test abcd');

/* ----------------------
   Rate Limiter
---------------------- */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retry_after_seconds: Math.ceil(
        (req.rateLimit.resetTime - Date.now()) / 1000
      ),
    });
  },
});

app.use(limiter);

/* ----------------------
   Static Files (IMPORTANT)
---------------------- */
app.use('/uploads', express.static('uploads'));
/* ----------------------
   Test Route
---------------------- */
app.get('/api/test', (req, res) => {
  res.send('API test works');
});
console.log('junaid aalam test 222');

/* ----------------------
   Swagger UI
---------------------- */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ----------------------
   Module Routes
---------------------- */
app.use('/api', routes);

/* ----------------------
   404 Handler
---------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/* ----------------------
   Global Error Handler
---------------------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;

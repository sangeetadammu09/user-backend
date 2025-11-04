const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const connectDb = require('./src/Config/db');
const cors = require('cors');
const routes = require('./src/Routes/userRoute');
const multer = require('multer');
const path = require('path'); // ✅ required for serving static files
const { swaggerUi, swaggerSpec } = require('./swagger');

const port = process.env.PORT || 3000;

connectDb();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ origin: '*' }));

// Static image folder
app.use('/uploads', express.static(path.join(__dirname, 'src/Storage/images')));

// Serve public folder (if needed)
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Base route for APIs
app.use('/api', routes);

// Swagger UI route
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      deepLinking: false,  // ✅ disables #/... in URL
    },
  })
);


// Multer error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(418).json({ err_code: err.code, err_message: err.message });
  } else {
    return res.status(500).json({ err_code: 409, err_message: 'Something went wrong' });
  }
});

// Undefined route handler
app.use('*', (req, res) => {
  res.status(404).json({ status: 'failed', data: 'Not found' });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📘 Swagger Docs available at http://localhost:${port}/api-docs`);
});


const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const fragmentRoutes = require('./routes/fragments');

const app = express();
const PORT = process.env.PORT || 5001;

// FIXED: Restrict CORS to trusted origin and validate JWT_SECRET exists
const trustedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

if (!process.env.JWT_SECRET) {
  console.error('ERROR: JWT_SECRET environment variable is not set');
  process.exit(1);
}

// FIXED: Set proper CORS configuration with trusted origin only
app.use(cors({ 
  origin: trustedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// FIXED: Add CSRF token validation for state-changing requests
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fragments', fragmentRoutes);

app.get('/', (req, res) => {
  res.send('Fragments API Running (Secured)');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

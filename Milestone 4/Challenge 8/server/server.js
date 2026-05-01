require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

const app = express();

// ✅ Fail fast validation
const REQUIRED_ENV = ['PORT', 'JWT_SECRET', 'DATABASE_URL'];

const missing = REQUIRED_ENV.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error(`[STARTUP ERROR] Missing env variables: ${missing.join(', ')}`);
  process.exit(1);
}

// ✅ Request logging
app.use(express.json());
app.use(morgan('dev'));

// Sample route
app.post('/expenses', (req, res) => {
  const start = Date.now();

  const expense = req.body;

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    route: 'POST /expenses',
    payload: expense,
    status: 201
  }));

  const duration = Date.now() - start;

  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: 'INFO',
    message: 'Expense created',
    duration: `${duration}ms`
  }));

  res.status(201).json({ ok: true });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`[STARTUP] Server running on port ${PORT}`);
});
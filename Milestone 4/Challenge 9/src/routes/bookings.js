const express = require('express');
const router = express.Router();
const bookingLimiter = require('../middleware/rateLimiter');
const { createBooking } = require('../services/bookingService');

router.post('/book', bookingLimiter, async (req, res) => {
  try {
    const result = await createBooking(req.body);

    if (result.status === 409) {
      return res.status(409).json({ error: result.error });
    }

    res.status(201).json(result.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
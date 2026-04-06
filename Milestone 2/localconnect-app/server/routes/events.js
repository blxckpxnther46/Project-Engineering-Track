const express = require('express');
const { getEvents, createEvent, updateEvent, rsvpEvent, deleteEvent } = require('../controllers/events');

const router = express.Router();

router.get('/', getEvents);
router.post('/', createEvent);
router.patch('/:id', updateEvent);
router.post('/:id/rsvp', rsvpEvent);
router.delete('/:id', deleteEvent);

module.exports = router;

const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');

router.get('/', eventsController.getEvents);
router.post('/', eventsController.createEvent);
router.patch('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

module.exports = router;

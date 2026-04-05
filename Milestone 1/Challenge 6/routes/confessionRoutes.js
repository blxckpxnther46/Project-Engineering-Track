const express = require('express');
const router = express.Router();
const controller = require('../controllers/confessionController');

router.post('/', controller.createConfession);
router.get('/', controller.getAllConfessions);
router.get('/:id', controller.getConfessionById);
router.get('/category/:cat', controller.getByCategory);
router.delete('/:id', controller.deleteConfession);

module.exports = router;

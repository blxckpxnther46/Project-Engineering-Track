const express = require('express');
const router = express.Router();
const directoryController = require('../controllers/directory');

router.get('/', directoryController.getDirectory);
router.post('/', directoryController.createDirectoryEntry);
router.patch('/:id', directoryController.updateDirectoryEntry);
router.delete('/:id', directoryController.deleteDirectoryEntry);

module.exports = router;

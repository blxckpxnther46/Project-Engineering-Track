const express = require('express');
const router = express.Router();
const validateUser = require('../middleware/validateUser.middleware');
const { createUser } = require('../controllers/user.controller');

router.post('/users', validateUser, createUser);

module.exports = router;
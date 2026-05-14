const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAllUsers, deleteUser } = require('../controllers/adminController');

// ✅ Fixed: Admin routes now protected with authMiddleware and roleMiddleware
router.get('/admin/users', authMiddleware, roleMiddleware('admin'), getAllUsers);
router.delete('/admin/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);

module.exports = router;

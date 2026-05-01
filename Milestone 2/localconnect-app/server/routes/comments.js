const express = require('express');
const { getComments, createComment, deleteComment } = require('../controllers/comments');

const router = express.Router();

router.get('/', getComments);
router.post('/', createComment);
router.delete('/:id', deleteComment);

module.exports = router;

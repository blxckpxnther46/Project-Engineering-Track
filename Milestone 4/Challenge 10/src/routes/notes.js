
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/api/notes', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(422).json({ message: 'Title is required' });
  }
  const note = await prisma.note.create({ data: { title } });
  res.status(201).json({ note });
});

router.get('/api/notes/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(404).json({ message: 'Note not found' });

  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) return res.status(404).json({ message: 'Note not found' });

  res.status(200).json({ note });
});

module.exports = router;

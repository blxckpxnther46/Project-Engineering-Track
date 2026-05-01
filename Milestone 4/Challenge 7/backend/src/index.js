const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ Better cache with TTL
const cache = new Map();
const TTL = 60 * 1000; // 60 seconds

function setCache(key, value) {
  cache.set(key, {
    data: value,
    expiry: Date.now() + TTL
  });
}

function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

function invalidateTaskCache(id) {
  cache.delete('tasks:list');
  cache.delete(`task:${id}`);
}

app.get('/tasks', async (req, res) => {
  try {
    const cacheKey = 'tasks:list';

    const cached = getCache(cacheKey);
    if (cached) {
      console.log('Serving from cache');
      return res.status(200).json(cached);
    }

    const tasks = await prisma.task.findMany();

    setCache(cacheKey, tasks);

    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const cacheKey = `task:${id}`;

  try {
    const cached = getCache(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    setCache(cacheKey, task);

    res.status(200).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});



app.post('/tasks', async (req, res) => {
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        price: parseFloat(price)
      }
    });

    // ✅ invalidate list cache
    cache.delete('tasks:list');

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.task.delete({
      where: { id }
    });

    // ✅ invalidate both caches
    invalidateTaskCache(id);

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Fixed Server running on http://localhost:${PORT}`);
});
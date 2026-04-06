const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let items = [];

app.get('/items', (req, res) => res.json(items));

app.post('/items', (req, res) => {
  const item = {
    id: uuid(),
    name: req.body.name,
    status: 'available',
    claimedBy: null,
    expiresAt: null
  };
  items.push(item);
  res.json(item);
});

app.post('/claim', (req, res) => {
  const { id, user } = req.body;
  const item = items.find(i => i.id === id);

  if (item.status !== 'available') {
    return res.status(400).json({ error: 'Already claimed' });
  }

  item.status = 'reserved';
  item.claimedBy = user;
  item.expiresAt = Date.now() + 30000;

  res.json(item);
});

app.post('/confirm', (req, res) => {
  const item = items.find(i => i.id === req.body.id);
  item.status = 'sold';
  res.json(item);
});

app.post('/force-remove', (req, res) => {
  const item = items.find(i => i.id === req.body.id);
  item.status = 'sold';
  res.json(item);
});

setInterval(() => {
  const now = Date.now();
  items.forEach(i => {
    if (i.status === 'reserved' && i.expiresAt < now) {
      i.status = 'available';
      i.claimedBy = null;
    }
  });
}, 5000);

app.listen(3000, () => console.log('Running'));

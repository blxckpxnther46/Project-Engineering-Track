const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let items = [];

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const { name, owner } = req.body;

  const item = {
    id: uuid(),
    name,
    owner,
    quantity: 100,
    requests: []
  };

  items.push(item);
  res.json(item);
});

app.post('/request', (req, res) => {
  const { itemId, user, amount } = req.body;

  const item = items.find(i => i.id === itemId);

  if (!item || item.quantity < amount) {
    return res.status(400).json({ error: 'Not enough quantity' });
  }

  const approved = item.requests
    .filter(r => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  if (approved + amount > item.quantity) {
    return res.status(400).json({ error: 'Conflict: already taken' });
  }

  const request = {
    id: uuid(),
    user,
    amount,
    status: 'pending',
    createdAt: Date.now()
  };

  item.requests.push(request);
  res.json(request);
});

app.post('/adjust', (req, res) => {
  const { itemId, newQuantity } = req.body;

  const item = items.find(i => i.id === itemId);

  item.quantity = newQuantity;

  item.requests.forEach(r => {
    if (r.amount > newQuantity) {
      r.status = 'invalid';
    }
  });

  res.json(item);
});

app.listen(3000, () => console.log('Server running on 3000'));

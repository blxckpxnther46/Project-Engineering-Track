require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let items = [];
let id = 1;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/items', (req, res) => {
  const newItem = { id: id++, ...req.body };
  items.push(newItem);
  res.json(newItem);
});

app.get('/items', (req, res) => {
  res.json(items);
});

app.put('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  items = items.map(item =>
    item.id === itemId ? { ...item, ...req.body } : item
  );
  res.json({ success: true });
});

app.delete('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  items = items.filter(item => item.id !== itemId);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

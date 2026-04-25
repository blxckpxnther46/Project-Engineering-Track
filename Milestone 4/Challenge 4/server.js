require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

const userController = require('./src/controllers/user.controller');

app.get('/users/:id', userController.getUser);
app.post('/users', userController.createUser);

const errorHandler = require('./src/middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
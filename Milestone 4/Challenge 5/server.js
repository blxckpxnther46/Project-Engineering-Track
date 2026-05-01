const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./src/routes/user.routes');
app.use('/', userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
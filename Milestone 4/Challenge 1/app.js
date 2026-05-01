
const express = require('express');
const app = express();

app.use(express.json());

// Route mounting
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

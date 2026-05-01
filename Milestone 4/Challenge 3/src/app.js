const express = require('express');
const app = express();

app.use(express.json());

const userRoutes = require('./routes/user.routes');
app.use('/users', userRoutes);

// ✅ error handler LAST
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
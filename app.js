const express = require('express');
const cors = require('cors');
// routes;
const userRoutes = require('./routes/user');
const gifRoutes = require('./routes/gif');
const articleRouter = require('./routes/article');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/gifs', gifRoutes);
app.use('/api/articles', articleRouter);
module.exports = app;

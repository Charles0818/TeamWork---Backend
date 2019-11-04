const express = require('express');
const cors = require('cors');
// routes;
const userRoutes = require('./routes/user');
const gifRoutes = require('./routes/gif');
const articleRouter = require('./routes/article');
const feedRoutes = require('./routes/feed');
const commentRoutes = require('./routes/comments');

const { urlencoded } = express;
const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/gifs', gifRoutes);
app.use('/api/v1/articles', articleRouter);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/articles', commentRoutes);
app.use('/api/v1/gifs', commentRoutes);
module.exports = app;

const express = require('express');
// routes;
const userRoutes = require('./routes/user');
const gifRoutes = require('./routes/gif');
const articleRoutes = require('./routes/article');
const feedRoutes = require('./routes/feed');
const commentRoutes = require('./routes/comments');

const { urlencoded } = express;
const app = express();
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/gifs', gifRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/feed', feedRoutes);
app.use('/api/v1/gifs', commentRoutes);
app.use('/api/v1/articles', commentRoutes);
module.exports = app;

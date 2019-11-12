const express = require('express');
const feed = require('../controllers/feed');
const auth = require('../middlewares/auth');

const router = express.Router();
router.get('/', auth, feed.getAllPosts);
router.patch('/:id/flag', auth, feed.flag);
module.exports = router;

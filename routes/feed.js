const express = require('express');
const feed = require('../controllers/feed');
const auth = require('../middlewares/auth');

const router = express.Router();
router.get('/', feed.getAllPosts);
router.patch('/:id/isFlagged', auth, feed.flag);
module.exports = router;

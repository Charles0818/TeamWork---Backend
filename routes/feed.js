const express = require('express');
const feed = require('../controllers/feed');

const router = express.Router();
router.get('/', feed.getAllPosts);
router.patch('/:id/isFlagged', feed.flag);
module.exports = router;

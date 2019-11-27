const express = require('express');
const feed = require('../controllers/feed');
const auth = require('../middlewares/auth');

const router = express.Router();
router.get('/:userId', auth, feed.getAllPosts);
router.patch('/:id/flag', auth, feed.flag);
router.get('/:employeeId/:userId', auth, feed.getAllPostsByAuthor);
module.exports = router;

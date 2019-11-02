const express = require('express');
const commentCtrl = require('../controllers/comments');

const router = express.Router();
router.post('/:contentID/comments', commentCtrl.postComment);
router.delete('/:contentID/comments/:commentId', commentCtrl.deleteComment);
router.patch('/:contentID/comments/:commentId', commentCtrl.modifyComment);
module.exports = router;

const express = require('express');
const commentCtrl = require('../controllers/comments');

const router = express.Router();
router.post('/:contentId/comments', commentCtrl.postComment);
router.delete('/:contentId/comments/:commentId', commentCtrl.deleteComment);
router.patch('/:contentId/comments/:commentId', commentCtrl.modifyComment);
router.patch('/:contentId/comments/:commentId/isFlagged', commentCtrl.flagComment);
module.exports = router;

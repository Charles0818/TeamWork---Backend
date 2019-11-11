const express = require('express');
const commentCtrl = require('../controllers/comments');
const auth = require('../middlewares/auth');

const router = express.Router();
router.post('/:contentId/comments', auth, commentCtrl.postComment);
router.delete('/:contentId/comments/:commentId', auth, commentCtrl.deleteComment);
router.patch('/:contentId/comments/:commentId', auth, commentCtrl.modifyComment);
router.patch('/:contentId/comments/:commentId/isFlagged', auth, commentCtrl.flagComment);
module.exports = router;

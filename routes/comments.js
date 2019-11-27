const express = require('express');
const commentCtrl = require('../controllers/comments');
const auth = require('../middlewares/auth');

const router = express.Router();
router.post('/:contentId/comment', auth, commentCtrl.postComment);
router.delete('/:contentId/comment/:commentId/:userId', auth, commentCtrl.deleteComment);
router.patch('/:contentId/comment/:commentId', auth, commentCtrl.modifyComment);
router.patch('/:contentId/comment/:commentId/flag', auth, commentCtrl.flag);
router.get('/:contentId/comments', auth, commentCtrl.count);
module.exports = router;

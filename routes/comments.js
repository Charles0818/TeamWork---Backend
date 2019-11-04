const express = require('express');
const commentCtrl = require('../controllers/comments');
const auth = require('../middlewares/auth');


const router = express.Router();
router.post('/:contentID/comments', auth, commentCtrl.postComment);
router.delete('/:contentID/comments/:commentId', auth, commentCtrl.deleteComment);
router.patch('/:contentID/comments/:commentId', auth, commentCtrl.modifyComment);
module.exports = router;

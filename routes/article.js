const express = require('express');
const articleCtrl = require('../controllers/article');

const router = express.Router();

router.post('/', articleCtrl.postArticle);
router.delete('/:id', articleCtrl.deleteArticle);
router.patch('/:id', articleCtrl.modifyArticle);
router.get('/:id', articleCtrl.getOneArticle);
module.exports = router;

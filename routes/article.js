const express = require('express');
const articleCtrl = require('../controllers/article');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/', auth, articleCtrl.postArticle);
router.delete('/:id/:userId', auth, articleCtrl.deleteArticle);
router.patch('/:id', auth, articleCtrl.modifyArticle);
router.get('/:id/:userId', auth, articleCtrl.getOneArticle);
module.exports = router;

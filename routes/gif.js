const express = require('express');
const multer = require('../middlewares/multer');
const gifCtrl = require('../controllers/gif');
const auth = require('../middlewares/auth');

const router = express.Router();
router.get('/:id/:userId', auth, gifCtrl.getOneGif);
router.post('/', auth, multer.any(), gifCtrl.postGif);
router.delete('/:id/:userId', auth, gifCtrl.deleteGif);
module.exports = router;

const express = require('express');
const multer = require('../middlewares/multer');
const gifCtrl = require('../controllers/gif');

const router = express.Router();
router.get('/:id', gifCtrl.getOneGif);
router.post('/', multer.any(), gifCtrl.postGif);
router.delete('/:id', gifCtrl.deleteGif);
module.exports = router;

const express = require('express');
// const multipart = require('mul');
const gifCtrl = require('../controllers/gif');
const multerConfig = require('../middlewares/multer');

const router = express.Router();
router.get('/:id', gifCtrl.getOneGif);
router.post('/', multerConfig.any(), gifCtrl.postGif);
router.delete('/:id', gifCtrl.deleteGif);
module.exports = router;

const express = require('express');
const multipart = require('connect-multiparty');
const gifCtrl = require('../controllers/gif');
// const auth = require('../middlewares/auth');

const router = express.Router();
const multipartyMiddleWare = multipart();
router.get('/', gifCtrl.getAllGifs);
router.post('/', multipartyMiddleWare, gifCtrl.postGif);
router.delete('/:id', gifCtrl.deleteGif);
module.exports = router;

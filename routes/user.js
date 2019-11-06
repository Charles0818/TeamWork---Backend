const express = require('express');
const multer = require('../middlewares/multer');
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.post('/create-user', auth, userCtrl.createUser);
router.post('/signin', userCtrl.login);
router.put('/user/:userId/', multer.any(), userCtrl.updateUserPic);

module.exports = router;

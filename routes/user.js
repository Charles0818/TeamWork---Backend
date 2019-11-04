const express = require('express');
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.post('/create-user', auth, userCtrl.createUser);
router.post('/signin', userCtrl.login);

module.exports = router;

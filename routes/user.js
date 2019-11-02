const express = require('express');
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.post('/create-user', userCtrl.createUser);
router.post('/login', auth, userCtrl.login);

module.exports = router;

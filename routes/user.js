const express = require('express');
const multer = require('../middlewares/multer');
const auth = require('../middlewares/auth');
const userCtrl = require('../controllers/user');

const router = express.Router();

router.post('/create-user', auth, userCtrl.createUser);
router.post('/signin', userCtrl.login);
router.patch('/users/:userId', auth, multer.any(), userCtrl.updateUserPic);
router.delete('/users/:employeeId/:userId', auth, userCtrl.deleteUser);
router.get('/users/:userId', auth, userCtrl.getAllUsers);

module.exports = router;

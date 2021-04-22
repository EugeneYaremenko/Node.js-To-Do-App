const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const validateCreateUser = require('../helpers/validation/validateCreateUser');
const validateSingIn = require('../helpers/validation/validateSingIn');
const verifiEmail = require('../routes/middlewares/verifiEmail');
const { authorize } = require('../routes/middlewares/authorize');

router.post('/signup', validateCreateUser, AuthController.createUser);
router.get('/verify/:verificationToken', verifiEmail);
router.put('/login', validateSingIn, AuthController.signIn);
router.patch('/logout', authorize, AuthController.logout);

module.exports = router;

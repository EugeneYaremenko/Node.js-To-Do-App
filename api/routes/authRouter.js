const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');
const AuthValidation = require('../helpers/validation/authValidation');

const verifiEmail = require('../routes/middlewares/verifiEmail');
const { authorize } = require('../routes/middlewares/authorize');

router.post('/signup', AuthValidation.validateCreateUser, AuthController.createUser);
router.post('/refresh-tokens', AuthController.refreshTokens);
router.get('/verify/:verificationToken', verifiEmail);
router.put('/login', AuthValidation.validateSingIn, AuthController.signIn);
router.patch('/logout', authorize, AuthController.logout);

module.exports = router;

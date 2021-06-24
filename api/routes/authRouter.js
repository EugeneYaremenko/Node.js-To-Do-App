const express = require('express');
const router = express.Router();
const passport = require('passport');

const AuthController = require('../controllers/authController');
const AuthValidation = require('../helpers/validation/authValidation');
require('../routes/middlewares/googleAuthenticate');

const verifiEmail = require('../routes/middlewares/verifiEmail');
const { authorize } = require('../routes/middlewares/authorize');

router.post(
  '/signup',
  AuthValidation.validateCreateUser,
  AuthController.createUser
);

router.post('/refresh-tokens', AuthController.refreshTokens);
router.get('/verify/:verificationToken', verifiEmail);
router.put('/login', AuthValidation.validateSingIn, AuthController.signIn);
router.patch('/logout', authorize, AuthController.logout);

// google auth

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

module.exports = router;

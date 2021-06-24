const bcryptjs = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

const authHelper = require('../helpers/authHelper');
const sendVerificationEmail = require('../helpers/sendVerificationEmail');
const AuthenticationError = require('../errors/AuthenticationError');

const createUser = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await authHelper.findUserByEmail(email);

    if (existingUser) {
      return res
        .status(400)
        .send({ message: 'User with such email alredy exists' });
    }

    const passwordHash = await bcryptjs.hash(password, 4);

    const user = await userModel.create({
      username,
      email,
      password: passwordHash,
    });

    sendVerificationEmail(user);

    return res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

const updateTokens = async userId => {
  const accessToken = await authHelper.generateAccessToken(userId);
  const refreshToken = await authHelper.generateRefreshToken();

  await authHelper.replaceDbRefreshTokenId(refreshToken.id, userId);

  return {
    accessToken,
    refreshToken: refreshToken.token,
  };
};

const refreshTokens = async (req, res) => {
  const { refreshToken } = req.body;
  const secret = process.env.JWT_SECRET;

  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);

    if (payload.type !== 'refresh') {
      res.status(400).json({ message: 'Invalid token' });

      return;
    }
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Token expired' });

      return;
    }

    if (err instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'Invalid token' });

      return;
    }
  }

  const token = await userModel.findOne({ refreshTokenId: payload.id }).exec();

  if (token === null) {
    throw new Error('Invalid token');
  }

  const tokens = await updateTokens(token._id);

  if (!tokens) {
    return res.status(400).json({ message: err.message });
  }

  return res.json(tokens);
};

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authHelper.findUserByEmail(email);

    if (!user || user.status !== 'Verified') {
      next(new AuthenticationError());
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      next(new AuthenticationError());
    }

    const tokens = await updateTokens(user._id);

    return res.status(200).json(tokens);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    if (req.session) {
      req.session = null;
      req.logout();
      res.redirect('/');

      return next();
    }

    const user = req.user;

    await authHelper.replaceDbRefreshTokenId(null, user._id);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const currentUser = await userModel.findById(userId);

    return res.status(200).json({
      email: currentUser.email,
      subscription: currentUser.subscription,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  updateTokens,
  refreshTokens,
  signIn,
  logout,
  getCurrentUser,
};

const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel');

const verifyUser = async userId => {
  return await userModel.findByIdAndUpdate(
    userId,
    {
      status: 'Verified',
      verificationToken: null,
    },
    { new: true }
  );
};

const findUserByEmail = async email => {
  return await userModel.findOne({ email });
};

const createVerificationToken = async (userId, verificationToken) => {
  return await userModel.findByIdAndUpdate(
    userId,
    {
      verificationToken,
    },
    {
      new: true,
    }
  );
};

const findByVerificationToken = async verificationToken => {
  return await userModel.findOne({
    verificationToken,
  });
};

const deleteVerificationTokenField = async delId => {
  return await userModel.findByIdAndUpdate(
    delId,
    { $unset: { verificationToken: 'null' } },
    {
      new: true,
    }
  );
};

const generateAccessToken = async userId => {
  const payload = {
    userId,
    type: 'access',
  };

  const options = { expiresIn: '20m' };
  const secret = process.env.JWT_SECRET;

  const accessToken = await jwt.sign(payload, secret, options);

  return accessToken;
};

const generateRefreshToken = async () => {
  const payload = {
    id: uuid.v4(),
    type: 'refresh',
  };

  const secret = process.env.JWT_SECRET;

  const options = { expiresIn: '1d' };

  const refreshToken = {
    id: payload.id,
    token: await jwt.sign(payload, secret, options),
  };

  return refreshToken;
};

const replaceDbRefreshTokenId = async (tokenId, userId) => {
  const newToken = await userModel
    .findOneAndUpdate({ _id: userId }, { refreshTokenId: tokenId })
    .exec();

  return newToken;
};

module.exports = {
  verifyUser,
  findUserByEmail,
  createVerificationToken,
  findByVerificationToken,
  deleteVerificationTokenField,
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshTokenId,
};

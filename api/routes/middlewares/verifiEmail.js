const userModel = require('../../models/userModel');
const NotFoundError = require('../../errors/NotFoundError');
const path = require('path');
const confirmEmailSuccessful = path.join(
  __dirname,
  '../../helpers/templates/confirmEmailSuccessful.html'
);
const confirmEmailerror = path.join(
  __dirname,
  '../../helpers/templates/confirmEmailerror.html'
);

const verifiEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const userToVerify = await userModel.findByVerificationToken(
      verificationToken
    );

    if (!userToVerify) {
      return new NotFoundError('User not found');
    }

    const verify = await userModel.verifyUser(userToVerify._id);

    if (!verify) {
      return res.status(500).sendFile(confirmEmailerror);
    }

    return res.status(200).sendFile(confirmEmailSuccessful);
  } catch (err) {
    next(err);
  }
};

module.exports = verifiEmail;

const authHelper = require('../../helpers/authHelper');
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

    const userToVerify = await authHelper.findByVerificationToken(
      verificationToken
    );

    if (!userToVerify) {
      return new NotFoundError('User not found');
    }

    const verify = await authHelper.verifyUser(userToVerify._id);

    if (!verify) {
      return res.status(500).sendFile(confirmEmailerror);
    }

    await authHelper.deleteVerificationTokenField(userToVerify._id);

    return res.status(200).sendFile(confirmEmailSuccessful);
  } catch (err) {
    next(err);
  }
};

module.exports = verifiEmail;

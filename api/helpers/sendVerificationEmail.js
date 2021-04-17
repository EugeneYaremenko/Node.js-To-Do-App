const sgMail = require('@sendgrid/mail');
const uuid = require('uuid');
const userModel = require('../models/userModel');
const emailMessageTemplate = require('../helpers/templates/emailMessageTemplate');

const sendVerificationEmail = async user => {
  try {
    const verificationToken = uuid.v4();

    await userModel.createVerificationToken(user._id, verificationToken);

    await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: user.email,
      from: process.env.NODEMAILER_USER,
      subject: 'Email verification',
      text: 'Please varificate your email',
      html: emailMessageTemplate(user.username, verificationToken),
    };

    await sgMail.send(msg);

    console.log('Email send');
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendVerificationEmail;

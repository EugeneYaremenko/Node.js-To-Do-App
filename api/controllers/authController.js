const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");

const sendVerificationEmail = require("../helpers/sendVerificationEmail");
const AuthenticationError = require("../errors/AuthenticationError");

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

class authController {
  async createUser(req, res, next) {
    try {
      const { username, password, email } = req.body;

      const existingUser = await userModel.findUserByEmail(email);

      if (existingUser) {
        return res
          .status(400)
          .send({ message: "User with such email alredy exists" });
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
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findUserByEmail(email);

      if (!user || user.status !== "Verified") {
        next(new AuthenticationError());
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        next(new AuthenticationError());
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "2d", //two days
      });

      await userModel.updateToken(user._id, token);

      return res.status(200).json({
        token: token,
        user: {
          email: email,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;

      await userModel.updateToken(user._id, null);
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
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
  }
}

module.exports = new authController();

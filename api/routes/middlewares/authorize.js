const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel");

const UnauthorizedError = require("../../errors/UnauthorizedError");

const authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (!authorizationHeader) {
      return new UnauthorizedError("No authorization header found");
    }

    const token = authorizationHeader.replace("Bearer ", "");

    if (!token) {
      return new UnauthorizedError("No JWT token found in header");
    }

    let userId;

    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (err) {
      next(new UnauthorizedError("User not authorized"));
    }

    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      return new UnauthorizedError("User not authorized");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authorize;

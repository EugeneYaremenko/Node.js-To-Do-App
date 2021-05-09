const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel");
const UnauthorizedError = require("../../errors/UnauthorizedError");

module.exports.authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization" || "");

    if (!authorizationHeader) {
      throw new UnauthorizedError("No authorization header found");
    }

    const token = authorizationHeader.replace("Bearer ", "");

    let userId;

    try {
      const payload = await jwt.verify(token, process.env.JWT_SECRET);

      if (payload.type !== "access") {
        res.status(401).json({ message: "Invalid token" });

        return;
      }

      userId = payload.userId;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        next(res.status(401).json({ message: "Token expired" }));
      }

      if (err instanceof jwt.JsonWebTokenError) {
        next(res.status(401).json({ message: "Invalid token" }));
      }

      next(new UnauthorizedError("User not authorized"));
    }

    const user = await userModel.findById(userId);

    if (user.refreshTokenId === null) {
      throw new UnauthorizedError("User not authorized");
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const validateCreateUser = require("../helpers/validation/validateCreateUser");
const validateSingIn = require("../helpers/validation/validateSingIn");
const verifiEmail = require("../routes/middlewares/verifiEmail");
const authorize = require("../routes/middlewares/authorize");

router.post("/signup", validateCreateUser, authController.createUser);
router.get("/verify/:verificationToken", verifiEmail);
router.put("/login", validateSingIn, authController.signIn);
router.patch("/logout", authorize, authController.logout);

module.exports = router;

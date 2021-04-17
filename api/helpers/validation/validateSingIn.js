const Joi = require("joi");

const validateSingIn = async (req, res, next) => {
  const signInRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = signInRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

module.exports = validateSingIn;

const Joi = require('joi');

const validateCreateUser = async (req, res, next) => {
  const validationRules = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net', 'ru'] },
    }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  });

  const validationResult = await validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

module.exports = validateCreateUser;

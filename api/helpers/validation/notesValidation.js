const Joi = require('joi');
const { Types: { ObjectId }} = require('mongoose');

const NotFoundError = require("../../errors/NotFoundError");

class notesValidation {
  async validateNoteId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      throw new NotFoundError();
    }

    next();
  }

  async validateCreateNote(req, res, next) {
    const validationRules = Joi.object({
      text: Joi.string().min(3).max(300).required(),
    });

    const validationResult = await validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  async validateUpdateNote(req, res, next) {
    const validationRules = Joi.object({
      text: Joi.string().alphanum().min(3).max(300),
      createdTime: Joi.date(),
      completed: Joi.boolean(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }
}

module.exports = new notesValidation();

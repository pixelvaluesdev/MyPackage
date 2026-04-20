const Joi = require('joi');

exports.login = Joi.object({
  email: Joi.required(),
  password: Joi.required(),
});

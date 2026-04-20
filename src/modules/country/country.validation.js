const Joi = require('joi');

exports.create = Joi.object({
  name: Joi.required(),
  email: Joi.required(),
  role_type: Joi.required(),
});

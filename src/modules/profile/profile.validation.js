const Joi = require('joi');

exports.create = Joi.object({
  first_name: Joi.required(),
  last_name: Joi.required(),
  email: Joi.required(),
  mobile_no: Joi.required(),
});

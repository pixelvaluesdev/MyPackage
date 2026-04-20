const Joi = require('joi');

exports.create = Joi.object({
  country_id: Joi.required(),
  state_name: Joi.required(),
  state_code: Joi.required(),
});

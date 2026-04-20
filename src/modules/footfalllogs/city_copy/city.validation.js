const Joi = require('joi');

exports.create = Joi.object({
  state_id: Joi.required(),
  city_name: Joi.required(),
  city_code: Joi.required(),
});

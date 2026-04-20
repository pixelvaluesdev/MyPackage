const Joi = require('joi');

exports.create = Joi.object({
  usr_name: Joi.required(),
  usr_last_name: Joi.required(),
  usr_email: Joi.required(),
  mobile_no: Joi.required()
});

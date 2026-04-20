const Joi = require('joi');

exports.create = Joi.object({
  locker_id: Joi.required(),
  status: Joi.required(),
  timestamp: Joi.optional(),
});

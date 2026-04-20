const Joi = require('joi');

exports.create = Joi.object({
  locker_id: Joi.required(),
  network: Joi.required(),
  lock_status: Joi.required(),
  camera: Joi.required(),
  temperature: Joi.required(),
  overall_status: Joi.required()
});

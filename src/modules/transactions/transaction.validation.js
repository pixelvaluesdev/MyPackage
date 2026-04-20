const Joi = require('joi');

exports.create = Joi.object({
  transaction_id: Joi.optional(),
  locker_id: Joi.optional(),
  event_type: Joi.optional(),
  compartment_size: Joi.optional(),
  time_taken_seconds: Joi.optional(),
  vendor: Joi.string().optional(),
  timestamp: Joi.optional(),
  delivery_person_name: Joi.optional(),
  flat_no: Joi.optional(),
  user_name: Joi.string().optional(),
  whatsapp_status: Joi.optional(),
  otp: Joi.optional(),
});

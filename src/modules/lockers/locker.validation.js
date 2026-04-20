const Joi = require('joi');

exports.create = Joi.object({
  locker_name: Joi.string().required(),
  state: Joi.number().required(),
  city: Joi.number().required(),
  area: Joi.string().required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
  status: Joi.string().required(),
  s_compartment: Joi.number().required(),
  m_compartment: Joi.number().required(),
  l_compartment: Joi.number().required(),
  exl_compartment: Joi.number().required()
});

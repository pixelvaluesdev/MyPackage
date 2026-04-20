const Joi = require('joi');

exports.create = Joi.object({
  locker_id: Joi.number().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required(),
  phone_no: Joi.string().required(),
  age: Joi.number().required(),
  floor_no: Joi.string().required(),
  flat_no: Joi.string().required(),
  building_no: Joi.string().required(),
});

exports.update = Joi.object({
  locker_id: Joi.number().required(),
  locker_name: Joi.string().required(),
  city: Joi.number().required(),
  area: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  status: Joi.string().required(),
});
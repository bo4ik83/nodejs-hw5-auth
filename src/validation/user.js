import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  mail: Joi.string().email().required(),
  password: Joi.string().required(),
});

import Joi from 'joi';
import { emailRegexp } from '../constans/users.js';

export const userSignupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(5).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(5).required(),
});

export const requestSendEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

export const resetPasswordShema = Joi.object({
  password: Joi.string().min(5).required(),
  token: Joi.string().required(),
});

import Joi from 'joi';
import { contactTypeList, phoneNumberRegexp } from '../constans/contacts.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .min(3)
    .max(20)
    .pattern(phoneNumberRegexp)
    .required(),
  email: Joi.string().email().allow('').optional(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .min(3)
    .max(20)
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20).pattern(phoneNumberRegexp),
  email: Joi.string().email().allow('').optional(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .min(3)
    .max(20),
});

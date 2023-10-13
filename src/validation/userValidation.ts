import Joi from "joi";

// schemas for input validation
export const registrationSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required()
});

export const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export const preferencesSchema = Joi.object({
  categories: Joi.array().items(Joi.string()),
  sources: Joi.array().items(Joi.string())
});

export const removePreferencesSchema = Joi.object({
  removeCategories: Joi.array().items(Joi.string()),
  removeSources: Joi.array().items(Joi.string())
});
import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

const usernameSchema = Joi.string()
  .min(5)
  .max(30)
  .pattern(/^[a-zA-Z][a-zA-Z0-9]*$/)
  .required()
  .messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least {#limit} characters long',
    'string.max': 'Username cannot exceed {#limit} characters',
    'string.pattern.base': 'Username must start with a letter and can only contain letters and numbers',
  });

const emailSchema = Joi.string().email().required();

const passwordSchema = Joi.string()
  .custom((value: string, helpers: Joi.CustomHelpers) => {
    const complexityOptions = {
      min: 8,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4
    };

    const { error } = passwordComplexity(complexityOptions).validate(value);
    if (error) {
      return helpers.error('any.invalid');
    }

    return value;
  })
  .required()
  .messages({
    'string.empty': 'Password is required',
    'any.invalid': 'Password must meet the complexity requirements'
  });

export {
  emailSchema,
  passwordSchema,
  usernameSchema
};




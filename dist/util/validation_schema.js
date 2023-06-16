'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.usernameSchema = exports.passwordSchema = exports.emailSchema = void 0;
const joi_1 = __importDefault(require('joi'));
const joi_password_complexity_1 = __importDefault(require('joi-password-complexity'));
const usernameSchema = joi_1.default
  .string()
  .min(5)
  .max(30)
  .pattern(/^[a-zA-Z][a-zA-Z0-9]*$/)
  .required()
  .messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least {#limit} characters long',
    'string.max': 'Username cannot exceed {#limit} characters',
    'string.pattern.base':
      'Username must start with a letter and can only contain letters and numbers'
  });
exports.usernameSchema = usernameSchema;
const emailSchema = joi_1.default.string().email().required();
exports.emailSchema = emailSchema;
const passwordSchema = joi_1.default
  .string()
  .custom((value, helpers) => {
    const complexityOptions = {
      min: 8,
      max: 26,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 4
    };
    const { error } = (0, joi_password_complexity_1.default)(complexityOptions).validate(value);
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
exports.passwordSchema = passwordSchema;

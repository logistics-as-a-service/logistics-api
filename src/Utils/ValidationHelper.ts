/* eslint-disable array-callback-return */
import Joi from '@hapi/joi';

/**
 * Joi helper class for validation
 * @developer Oyewole Abayomi Samuel
 */
export default class ValidationHelper {
  static updatePassword() {
    return Joi.object().keys({
      current_password: Joi.string().required().error(new Error('Current password is required!')),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/)
        .required()
        .error(new Error('Invalid password, special character is not allow!')),
      confirm_password: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .error(new Error('Password and confirm password must match')),
    });
  }

  static validatePasswordOnly() {
    return Joi.object().keys({
      password: Joi.string()
        .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/)
        .required()
        .error(new Error('Invalid password, special character is not allow!')),
      confirm_password: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .error(new Error('Password and confirm password must match')),
    });
  }

  static resetPassword() {
    return Joi.object().keys({
      current_password: Joi.string()
        .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/) // /^[a-zA-Z0-9]{3,30}$/
        .required()
        .error(new Error('Please provide old password!')),
      new_password: Joi.string()
        .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/) // /^[a-zA-Z0-9]{3,30}$/
        .required()
        .error(new Error('Invalid new password, special character is not allow!')),
    });
  }

  static validateUser() {
    return Joi.object().keys({
      first_name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .error(new Error('First name must be at least 3 characters long')),
      last_name: Joi.string()
        .min(3)
        .max(30)
        .required()
        .error(new Error('Last name must be at least 3 characters long')),
      email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .error(new Error('Email address is required!')),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/)
        .required()
        .error(new Error('Invalid password, special character is not allow!')),
      confirm_password: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .error(new Error('Password and confirm password must match')),
      mobile_no: Joi.string().required().error(new Error('Phone number is compulsory')),
    });
  }

  static validateLogin() {
    return Joi.object()
      .keys({
        email: Joi.string()
          .email({ minDomainSegments: 2 })
          .required()
          .error(new Error('Valid email address is required!')),
        password: Joi.string()
          .required()
          .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/),
      })
      .with('email', 'password');
  }
}

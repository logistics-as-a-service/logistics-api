import Joi, { CustomHelpers } from '@hapi/joi';
import { validate as validateEmail } from 'email-validator';

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
      mobile_no: Joi.string().max(11).required().error(new Error('Phone number is compulsory')),
    });
  }

  static validatePartner() {
    const schemaContact = Joi.object().keys({
      mobile_no: Joi.string().max(11).required(),
    });

    const urlValidation = (field: string) =>
      Joi.string()
        .regex(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        )
        .optional()
        .error(new Error(`${field} not valid`));

    return Joi.object().keys({
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
      full_name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .error(new Error('Full name must be at least 3 characters long')),
      company_name: Joi.string()
        .min(5)
        .max(100)
        .required()
        .error(new Error('Company must be at least 5 characters long')),
      business_address: Joi.string()
        .min(10)
        .max(100)
        .required()
        .error(new Error('Business address must be at least 10 characters long')),
      business_email: Joi.string()
        .email({ minDomainSegments: 2 })
        .required()
        .error(new Error('Business email address is required!')),
      domain: Joi.string().domain().required().error(new Error('Please enter valid domain name!')),
      subdomain: Joi.string()
        .regex(/^([a-zA-Z0-9][a-zA-Z0-9-_]*\.)*[a-zA-Z0-9]*[a-zA-Z0-9-_]*[[a-zA-Z0-9]+$/)
        .required()
        .error(new Error('Sub domain is not valid!')),
      subscription: Joi.number().required().error(new Error('Subscription type is required!')),
      contacts: Joi.array()
        .items(schemaContact)
        .required()
        .error(new Error('Please provide array of phone number')),
      state_id: Joi.number().required().error(new Error('State is required')),
      city_id: Joi.number().required().error(new Error('City is required')),
      banner_url: urlValidation('banner url'),
      logo_url: urlValidation('logo url'),
      facebook_url: urlValidation('facebook url'),
      instagram_url: urlValidation('instagram url'),
      linkedin_url: urlValidation('linkedin url'),
      website_url: Joi.string().domain().optional().error(new Error('Check website url')),
    });
  }

  static validatePartnerUpdate() {
    const schemaContact = Joi.object().keys({
      mobile_no: Joi.string().max(11).required(),
    });

    const urlValidation = (field: string) =>
      Joi.string()
        .regex(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        )
        .optional()
        .error(new Error(`${field} not valid`));

    return Joi.object().keys({
      full_name: Joi.string()
        .min(5)
        .max(50)
        .error(new Error('Full name must be at least 5 characters long')),
      company_name: Joi.string()
        .min(10)
        .max(100)
        .error(new Error('Company must be at least 10 characters long')),
      business_address: Joi.string()
        .min(10)
        .max(100)
        .error(new Error('Business address must be at least 10 characters long')),
      business_email: Joi.string()
        .email({ minDomainSegments: 2 })
        .error(new Error('Business email address is required!')),
      domain: Joi.string().domain().error(new Error('Please enter valid domain name!')),
      subdomain: Joi.string()
        .regex(/^([a-zA-Z0-9][a-zA-Z0-9-_]*\.)*[a-zA-Z0-9]*[a-zA-Z0-9-_]*[[a-zA-Z0-9]+$/)
        .error(new Error('Sub domain is not valid!')),
      contacts: Joi.array()
        .items(schemaContact)
        .error(new Error('Please provide array of phone number')),
      subscription: Joi.number().error(new Error('Subscription type is required!')),
      state_id: Joi.number().error(new Error('State is required')),
      city_id: Joi.number().error(new Error('City is required')),
      banner_url: urlValidation('banner url'),
      logo_url: urlValidation('logo url'),
      facebook_url: urlValidation('facebook url'),
      instagram_url: urlValidation('instagram url'),
      linkedin_url: urlValidation('linkedin url'),
      website_url: Joi.string().domain().optional().error(new Error('Website url is not valid!')),
    });
  }

  static validateSubUpdate() {
    return Joi.object().keys({
      name: Joi.string()
        .min(3)
        .max(100)
        .error(new Error('Subscription name must be at least 5 characters long')),
      description: Joi.string().error(new Error('Description is required')),
      price: Joi.number().error(new Error('Price is required!')),
      subscription_duration: Joi.number().error(
        new Error('Subscription type duration is required!')
      ),
      type: Joi.string().error(new Error('Subscription type is required!')),
      is_disabled: Joi.boolean().error(new Error('Disable field is required')),
    });
  }

  static validateSub() {
    return Joi.object().keys({
      name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .error(new Error('Subscription name must be at least 5 characters long')),
      description: Joi.string().required().error(new Error('Description is required')),
      price: Joi.number().required().error(new Error('Price is required!')),
      subscription_duration: Joi.number()
        .required()
        .error(new Error('Subscription type duration is required!')),
      type: Joi.string().required().error(new Error('Subscription type is required!')),
      is_disabled: Joi.boolean().error(new Error('Disable field is required')),
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

  static validateRider() {
    const method = (email: any, helpers: CustomHelpers) => {
      const isValid: boolean = validateEmail(email);
      if (!isValid) return helpers.message({ custom: `${email}: invalid email address` });

      return email;
    };

    return Joi.object().keys({
      email: Joi.string()
        .custom(method, 'email validation')
        .required()
        .error((errors) => {
          return new Error(errors.map((err) => err).join(' and '));
        }),
      password: Joi.string()
        .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/)
        .required()
        .error(new Error('Invalid password, special character is not allow!')),
      confirm_password: Joi.any()
        .valid(Joi.ref('password'))
        .required()
        .error(new Error('Password and confirm password must match')),
      first_name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .error(new Error('First name must be at least 3 characters long')),
      last_name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .error(new Error('Last name must be at least 3 characters long')),
      mobile_no: Joi.string()
        .max(11)
        .required()
        .error(new Error('Phone number is required and must be at 11')),
    });
  }

  static validateUpdateRider() {
    return Joi.object().keys({
      first_name: Joi.string()
        .min(3)
        .required()
        .error(new Error('First name must be at least 3 characters long')),
      last_name: Joi.string()
        .min(3)
        .max(100)
        .error(new Error('Last name must be at least 3 characters long')),
      mobile_no: Joi.string()
        .max(11)
        .error(new Error('Phone number is required and must be at 11')),
      is_engaged: Joi.boolean().error(new Error('Is rider engage? field required!')),
      is_retired: Joi.boolean().error(new Error('Retired or disable rider? field required!')),
    });
  }

  static validateDeliverySettings() {
    return Joi.object().keys({
        lower_bound: Joi.number()
            .min(0)
            .error(new Error('Lower bound must not be lower than 0')),
         upper_bound: Joi.number()
             .min(1)
             .error(new Error('Upper bound must not be lower than 1')),
         cost: Joi.number()
             .min(0)
             .error(new Error('Please enter a valid financial value'))
    });
  }
}

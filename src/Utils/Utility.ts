import bcrypt from 'bcrypt';
import phoneUtil from 'google-libphonenumber';
import CustomError from './CustomError';
import * as EmailValidator from 'email-validator';

const phoneUtilInstance = phoneUtil.PhoneNumberUtil.getInstance();
const { E164 } = phoneUtil.PhoneNumberFormat;

export default class Utility {
  /**
   * Method to format phone number
   * @param {string} phone
   */
  static formatPhoneNumber(phone: string): string {
    // check if number is equal to 11
    if (phone.length !== 11) {
      throw new CustomError(400, 'Incorrect phone number, check and try again!');
    }

    const number = phoneUtilInstance.parseAndKeepRawInput(phone, 'NG');
    const check = phoneUtilInstance.isValidNumberForRegion(number, 'NG');

    if (!check) {
      throw new CustomError(400, 'Incorrect phone number, check and try again!');
    }

    return phoneUtilInstance.format(number, E164);
  }

  /**
   * Validate Email
   * @param email string
   */
  static validateEmail(email: string): string {
    const isValid: boolean = EmailValidator.validate(email);
    if (!isValid) {
      throw new Error(`'${email}' is not a valid email address`);
    }
    return email;
  }

  /**
   * Encrypt password
   * @param password
   */
  static encryptPassword(password: string) {
    const saltRounds = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, saltRounds);
  }

  /**
   * Generate unique ID
   * @returns string
   */
  static generateID(m = Math, d = Date, h = 16, s = (s) => m.floor(s).toString(h)) {
    return s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
  }
}

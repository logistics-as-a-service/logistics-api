import phoneUtil from 'google-libphonenumber';
import CustomError from './CustomError';

const phoneUtilInstance = phoneUtil.PhoneNumberUtil.getInstance();
const { E164 } = phoneUtil.PhoneNumberFormat;

export default class PhoneUtility {
  /**
   * Method to format phone number
   * @param {string} phone
   */
  static formatPhoneNumber(phone: string) {
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
}

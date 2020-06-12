import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';

export default class PartnerController {
  /**
   * Endpoint for partner signup
   */
  static async registerPartner(req: Request, res: Response, _next: NextFunction) {
    const payload = pick(req.body, [
      'email',
      'password',
      'mobile_no',
      'company_name',
      'business_address',
      'business_email',
      'banner_url',
      'logo_url',
      'facebook_url',
      'instagram_url',
      'linkedin_url',
      'website_url',
      'subdomain',
      'domain',
      'subscription',
      'contacts',
      'bank_acct_no',
      'bank_name',
      'bank_acct_name',
      'paystack_pub_key',
      'paystack_sec_key',
      'flw_pub_key',
    ]);
  }
}

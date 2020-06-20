import Partner from '../../database/entity/Partner';
import Customer from '../../database/entity/Customer';
import Rider from '../../database/entity/Riders';
import Admin from '../../database/entity/Admin';

export default class UserResponse {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.mobileNo = user.mobileNo;
    this.userType = user.userType;
    this.isDisabled = user.isDisabled;
    this.admin = user.admin ? user.admin : undefined;
    this.partner = user.partner ? user.partner : undefined;
    this.customer = user.customer ? user.customer : undefined;
    this.rider = user.rider ? user.rider : undefined;

    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  id: number;
  email: string;
  mobileNo: string;
  userType: any;
  lastLoginIp: string;
  lastLoginDate: Date;
  isDisabled: boolean;
  admin: Admin;
  partner: Partner;
  customer: Customer;
  rider: Rider;
  createdAt: Date;
  updatedAt: Date;
}

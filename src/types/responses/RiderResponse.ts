import User from '../../database/entity/User';

export default class RiderResponse {
  constructor(payload: any) {
    this.id = payload.id;
    this.firstName = payload.firstName;
    this.lastName = payload.lastName;
    this.profileImage = payload.profileImage;
    this.isEngaged = payload.isEngaged;
    this.isRetired = payload.isRetired;
    this.user = {
      id: payload.user.id,
      email: payload.user.email,
      mobileNo: payload.user.mobileNo,
      isDisabled: payload.user.isDisabled,
    };
  }

  id: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  isEngaged: boolean;
  isRetired: boolean;
  user: Partial<User>;
}

import Rider from '../../database/entity/Riders';

export default class RiderResponse {
  constructor(payload: any) {
    this.fullName = payload.fullName;
    this.companyName = payload.companyName;
    this.businessAddress = payload.businessAddress;
    this.riders = payload.riders;
  }

  fullName: string;
  companyName: string;
  businessAddress: string;
  riders: Rider[];
}

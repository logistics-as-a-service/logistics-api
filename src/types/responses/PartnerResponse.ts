import Rider from '../../database/entity/Riders';

export default class PartnerResponse {
  constructor(payload: any) {
    this.id = payload.id;
    this.fullName = payload.fullName;
    this.companyName = payload.companyName;
    this.businessAddress = payload.businessAddress;
    this.riders = payload.riders;
  }

  id: string;
  fullName: string;
  companyName: string;
  businessAddress: string;

  riders: Rider[];
}

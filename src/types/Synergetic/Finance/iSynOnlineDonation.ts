type iSynOnlineDonation = {
  OnDonationID: number;
  DonationDate: Date | string;
  Preferred: string;
  Surname: string;
  Email: string;
  MobilePhone: string;
  DonationFundCode: string | null;
  DonationFund: string;
  DonationAmount: number;
  AnonymousDonationFlag: boolean;
  GatewayTransactionCode: string | null;
  GatewauResponseCode: string | null;
  GatewayResponseText: string | null;
  GatewaytError: string | null;
  FullAddress: string | null;
  CustomerReferenceNumber: string;
  Active: boolean;
  CreatedAt: Date | string;
  UpdatedAt: Date | string;
}

export default iSynOnlineDonation;

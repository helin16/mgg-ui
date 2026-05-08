type iSynCommunityLegal = {
  ID: number;
  ParentsSeparatedFlag: boolean;
  ParentsSeparatedReason: string;
  CourtOrderType: string;
  CourtOrderDate: Date | string | null;
  CourtOrderDetails: string;
  PhotoWebFlag: boolean;
  PhotoPromFlag: boolean;
  PhotoPublicationFlag: boolean;
  PrivacyPolicyAgreedFlag: boolean;
  ModifiedBy: number;
  ModifiedDate: Date | string | null;
};

export default iSynCommunityLegal;

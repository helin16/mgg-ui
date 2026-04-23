import iSynLuCourtOrderType from '../Lookup/iSynLuCourtOrderType';

type iSynCommunityLegal =  {
  ID: number;
  ParentsSeparatedFlag: boolean;
  ParentsSeparatedReason: string;
  CourtOrderType: string;
  CourtOrderDate: Date | null;
  CourtOrderDetails: string;
  PhotoWebFlag: boolean;
  PhotoPromFlag: boolean;
  PhotoPublicationFlag: boolean;
  PrivacyPolicyAgreedFlag: boolean;
  ModifiedBy: number;
  ModifiedDate: Date | null;
  LuCourtOrderType?: iSynLuCourtOrderType;
}

export default iSynCommunityLegal;

import iSynCommunity from '../iSynCommunity';
import iSynLuConsentType from '../Lookup/iSynLuConsentType';

type iSynCommunityConsent = {
  ConsentSeq: number;
  ID: number;
  ConsentCode: string;
  ActiveFlag: boolean;
  ConsentGivenBy: number;
  ConsentGivenDate: Date | string | null;
  ConsentExpiryDate: Date | string | null;
  ConsentRefusalComment: string | null;
  ModifiedBy: number | null;
  ModifiedDate: Date | string | null;
  SynCommunity?: iSynCommunity;
  ModifiedByProfile?: iSynCommunity;
  ConsentGivenByProfile?: iSynCommunity;
  SynLuConsentType?: iSynLuConsentType;
}

export default iSynCommunityConsent;

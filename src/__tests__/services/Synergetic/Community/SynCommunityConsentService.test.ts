import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunityConsentService from '../../../../services/Synergetic/Community/SynCommunityConsentService';

describe('SynCommunityConsentService', () => {
  const endPoint = '/syn/communityConsent';

  ServiceTestHelper.testGetAll(endPoint, SynCommunityConsentService.getAll);
});

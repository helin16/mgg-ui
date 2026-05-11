import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunityConsentService from '../../../../services/Synergetic/Community/SynCommunityConsentService';

describe('SynCommunityConsentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynCommunityConsentService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/communityConsent"),
  });
});

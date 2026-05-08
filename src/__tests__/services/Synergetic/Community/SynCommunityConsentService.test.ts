import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunityConsentService from '../../../../services/Synergetic/Community/SynCommunityConsentService';

describe('SynCommunityConsentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynCommunityConsentService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/communityConsent", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

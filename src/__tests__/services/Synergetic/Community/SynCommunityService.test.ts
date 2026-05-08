import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynCommunityService from '../../../../services/Synergetic/Community/SynCommunityService';

describe('SynCommunityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getCommunityProfiles',
    serviceFn: SynCommunityService.getCommunityProfiles,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/community", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

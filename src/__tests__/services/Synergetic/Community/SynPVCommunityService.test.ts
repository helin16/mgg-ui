import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynPVCommunityService from '../../../../services/Synergetic/Community/SynPVCommunityService';

describe('SynPVCommunityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynPVCommunityService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/pvCommunity", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

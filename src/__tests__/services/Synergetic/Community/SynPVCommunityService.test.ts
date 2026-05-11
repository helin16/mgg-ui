import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynPVCommunityService from '../../../../services/Synergetic/Community/SynPVCommunityService';

describe('SynPVCommunityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynPVCommunityService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/pvCommunity"),
  });
});

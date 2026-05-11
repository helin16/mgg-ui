import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynTagListCommunityService from '../../../../services/Synergetic/Tag/SynTagListCommunityService';

describe('SynTagListCommunityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynTagListCommunityService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/tagListCommunity"),
  });
});

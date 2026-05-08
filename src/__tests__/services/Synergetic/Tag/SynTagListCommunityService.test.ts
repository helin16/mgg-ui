import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynTagListCommunityService from '../../../../services/Synergetic/Tag/SynTagListCommunityService';

describe('SynTagListCommunityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynTagListCommunityService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/tagListCommunity", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

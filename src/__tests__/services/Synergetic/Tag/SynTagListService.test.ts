import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynTagListService from '../../../../services/Synergetic/Tag/SynTagListService';

describe('SynTagListService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynTagListService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/tagList", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynConstituencyService from '../../../../services/Synergetic/Community/SynConstituencyService';

describe('SynConstituencyService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynConstituencyService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/constituency", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynConfigUserService from '../../../services/Synergetic/SynConfigUserService';

describe('SynConfigUserService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynConfigUserService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/configUser", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

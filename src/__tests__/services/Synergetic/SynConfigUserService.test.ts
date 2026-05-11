import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SynConfigUserService from '../../../services/Synergetic/SynConfigUserService';

describe('SynConfigUserService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynConfigUserService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/configUser"),
  });
});

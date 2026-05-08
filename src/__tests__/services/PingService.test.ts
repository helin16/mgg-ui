import ServiceTestHelper from '../helper/ServiceTestHelper';
import PingService from '../../services/PingService';

describe('PingService', () => {
  ServiceTestHelper.testCustom({
    name: 'ping',
    serviceFn: PingService.ping,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/ping", {"fakeParams":"value"}],
  });
});

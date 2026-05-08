import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuFutureStatusService from '../../../../services/Synergetic/Lookup/SynLuFutureStatusService';

describe('SynLuFutureStatusService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuFutureStatusService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luFutureStatus", {"fakeParams":"value"}],
  });
});

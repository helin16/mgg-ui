import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuStateService from '../../../../services/Synergetic/Lookup/SynLuStateService';

describe('SynLuStateService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuStateService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luState", {"fakeParams":"value"}],
  });
});

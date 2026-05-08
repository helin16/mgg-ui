import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuConstituencyService from '../../../../services/Synergetic/Lookup/SynLuConstituencyService';

describe('SynLuConstituencyService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuConstituencyService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luConstituency", {"fakeParams":"value"}],
  });
});

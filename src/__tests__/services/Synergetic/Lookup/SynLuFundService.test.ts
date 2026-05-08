import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuFundService from '../../../../services/Synergetic/Lookup/SynLuFundService';

describe('SynLuFundService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuFundService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luFund/", {"fakeParams":"value"}],
  });
});

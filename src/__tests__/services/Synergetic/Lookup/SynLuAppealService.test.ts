import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuAppealService from '../../../../services/Synergetic/Lookup/SynLuAppealService';

describe('SynLuAppealService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuAppealService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luAppeal/", {"fakeParams":"value"}],
  });
});

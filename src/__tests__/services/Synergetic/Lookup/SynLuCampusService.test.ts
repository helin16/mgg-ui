import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuCampusService from '../../../../services/Synergetic/Lookup/SynLuCampusService';

describe('SynLuCampusService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAllCampuses',
    serviceFn: SynLuCampusService.getAllCampuses,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luCampus", {"fakeParams":"value"}],
  });
});

import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuReligionService from '../../../../services/Synergetic/Lookup/SynLuReligionService';

describe('SynLuReligionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuReligionService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luReligion", {"fakeParams":"value"}],
  });
});

import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuSchoolService from '../../../../services/Synergetic/Lookup/SynLuSchoolService';

describe('SynLuSchoolService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuSchoolService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luSchool", {"fakeParams":"value"}],
  });
});

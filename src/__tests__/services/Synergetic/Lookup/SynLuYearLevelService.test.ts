import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuYearLevelService from '../../../../services/Synergetic/Lookup/SynLuYearLevelService';

describe('SynLuYearLevelService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAllYearLevels',
    serviceFn: SynLuYearLevelService.getAllYearLevels,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/syn/luYearLevel", {"fakeParams":"value"}],
  });
});

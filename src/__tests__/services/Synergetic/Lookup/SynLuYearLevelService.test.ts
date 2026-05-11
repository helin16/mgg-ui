import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuYearLevelService from '../../../../services/Synergetic/Lookup/SynLuYearLevelService';

describe('SynLuYearLevelService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAllYearLevels',
    serviceFn: SynLuYearLevelService.getAllYearLevels,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luYearLevel"),
  });
});

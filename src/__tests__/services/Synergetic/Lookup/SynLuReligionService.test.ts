import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuReligionService from '../../../../services/Synergetic/Lookup/SynLuReligionService';

describe('SynLuReligionService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuReligionService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luReligion"),
  });
});

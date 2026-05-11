import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuGenderService from '../../../../services/Synergetic/Lookup/SynLuGenderService';

describe('SynLuGenderService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuGenderService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luGender"),
  });
});

import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuNationalityService from '../../../../services/Synergetic/Lookup/SynLuNationalityService';

describe('SynLuNationalityService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuNationalityService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luNationality"),
  });
});

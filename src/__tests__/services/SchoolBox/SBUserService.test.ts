import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SBUserService from '../../../services/SchoolBox/SBUserService';

describe('SBUserService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SBUserService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/sb/user"),
  });
});

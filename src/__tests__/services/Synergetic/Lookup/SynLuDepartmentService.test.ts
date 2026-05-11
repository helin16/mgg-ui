import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuDepartmentService from '../../../../services/Synergetic/Lookup/SynLuDepartmentService';

describe('SynLuDepartmentService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuDepartmentService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luDepartment"),
  });
});

import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuStaffCategoryService from '../../../../services/Synergetic/Lookup/SynLuStaffCategoryService';

describe('SynLuStaffCategoryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynLuStaffCategoryService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/syn/luStaffCategory"),
  });
});

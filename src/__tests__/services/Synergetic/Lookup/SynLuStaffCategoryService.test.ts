import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuStaffCategoryService from '../../../../services/Synergetic/Lookup/SynLuStaffCategoryService';

describe('SynLuStaffCategoryService', () => {
  const endPoint = '/syn/luStaffCategory';

  ServiceTestHelper.testGetAll(endPoint, SynLuStaffCategoryService.getAll);
});

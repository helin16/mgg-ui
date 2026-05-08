import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuDepartmentService from '../../../../services/Synergetic/Lookup/SynLuDepartmentService';

describe('SynLuDepartmentService', () => {
  const endPoint = '/syn/luDepartment';

  ServiceTestHelper.testGetAll(endPoint, SynLuDepartmentService.getAll);
});

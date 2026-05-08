import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuSchoolService from '../../../../services/Synergetic/Lookup/SynLuSchoolService';

describe('SynLuSchoolService', () => {
  const endPoint = '/syn/luSchool';

  ServiceTestHelper.testGetAll(endPoint, SynLuSchoolService.getAll);
});

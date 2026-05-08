import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynLuNationalityService from '../../../../services/Synergetic/Lookup/SynLuNationalityService';

describe('SynLuNationalityService', () => {
  const endPoint = '/syn/luNationality';

  ServiceTestHelper.testGetAll(endPoint, SynLuNationalityService.getAll);
});

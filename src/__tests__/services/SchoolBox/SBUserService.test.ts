import ServiceTestHelper from '../../helper/ServiceTestHelper';
import SBUserService from '../../../services/SchoolBox/SBUserService';

describe('SBUserService', () => {
  const endPoint = '/sb/user';

  ServiceTestHelper.testGetAll(endPoint, SBUserService.getAll);
});

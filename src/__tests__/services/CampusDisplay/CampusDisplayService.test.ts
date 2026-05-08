import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayService from '../../../services/CampusDisplay/CampusDisplayService';

describe('CampusDisplayService', () => {
  const endPoint = '/campusDisplay';

  ServiceTestHelper.testGetAll(endPoint, CampusDisplayService.getAll);
  ServiceTestHelper.testCreate(endPoint, CampusDisplayService.create);
  ServiceTestHelper.testUpdate(endPoint, CampusDisplayService.update);
  ServiceTestHelper.testDeactivate(endPoint, CampusDisplayService.deactivate);
});

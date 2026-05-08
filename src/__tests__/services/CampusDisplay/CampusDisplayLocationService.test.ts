import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayLocationService from '../../../services/CampusDisplay/CampusDisplayLocationService';

describe('CampusDisplayLocationService', () => {
  const endPoint = '/campusDisplayLocation';

  ServiceTestHelper.testGetAll(endPoint, CampusDisplayLocationService.getAll);
  ServiceTestHelper.testGet(endPoint, CampusDisplayLocationService.getById);
  ServiceTestHelper.testCreate(endPoint, CampusDisplayLocationService.create);
  ServiceTestHelper.testUpdate(endPoint, CampusDisplayLocationService.update);
  ServiceTestHelper.testDeactivate(endPoint, CampusDisplayLocationService.deactivate);
});

import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MggAppService from '../../../services/Settings/MggAppService';

describe('MggAppService', () => {
  const endPoint = '/app';

  ServiceTestHelper.testGetAll(endPoint, MggAppService.getAll);
  ServiceTestHelper.testGet(endPoint, MggAppService.get);
  ServiceTestHelper.testCreate(endPoint, MggAppService.create);
  ServiceTestHelper.testUpdate(endPoint, MggAppService.update);
  ServiceTestHelper.testDeactivate(endPoint, MggAppService.deactivate);
});

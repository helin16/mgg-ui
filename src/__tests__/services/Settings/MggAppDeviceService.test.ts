import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MggAppDeviceService from '../../../services/Settings/MggAppDeviceService';

describe('MggAppDeviceService', () => {
  const endPoint = '/appDevice';

  ServiceTestHelper.testGetAll(endPoint, MggAppDeviceService.getAll);
  ServiceTestHelper.testGet(endPoint, MggAppDeviceService.get);
  ServiceTestHelper.testCreate(endPoint, MggAppDeviceService.create);
  ServiceTestHelper.testUpdate(endPoint, MggAppDeviceService.update);
  ServiceTestHelper.testDeactivate(endPoint, MggAppDeviceService.deactivate);
});

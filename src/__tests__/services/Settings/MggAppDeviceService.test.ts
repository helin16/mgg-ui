import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MggAppDeviceService from '../../../services/Settings/MggAppDeviceService';

describe('MggAppDeviceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: MggAppDeviceService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/appDevice"),
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: MggAppDeviceService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/appDevice"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: MggAppDeviceService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/appDevice"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: MggAppDeviceService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/appDevice"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: MggAppDeviceService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/appDevice"),
  });
});

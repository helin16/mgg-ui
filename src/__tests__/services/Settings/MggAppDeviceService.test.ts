import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MggAppDeviceService from '../../../services/Settings/MggAppDeviceService';

describe('MggAppDeviceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: MggAppDeviceService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/appDevice", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: MggAppDeviceService.get,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/appDevice/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: MggAppDeviceService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/appDevice", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: MggAppDeviceService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/appDevice/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: MggAppDeviceService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/appDevice/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MggAppService from '../../../services/Settings/MggAppService';

describe('MggAppService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: MggAppService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/app", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: MggAppService.get,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/app/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: MggAppService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/app", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: MggAppService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/app/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: MggAppService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/app/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

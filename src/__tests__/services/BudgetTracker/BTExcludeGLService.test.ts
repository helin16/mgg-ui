import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTExcludeGLService from '../../../services/BudgetTracker/BTExcludeGLService';

describe('BTExcludeGLService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: BTExcludeGLService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/glExcludeCodes", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: BTExcludeGLService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/glExcludeCodes", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: BTExcludeGLService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/glExcludeCodes/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

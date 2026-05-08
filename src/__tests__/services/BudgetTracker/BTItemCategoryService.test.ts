import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTItemCategoryService from '../../../services/BudgetTracker/BTItemCategoryService';

describe('BTItemCategoryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: BTItemCategoryService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/itemCategory", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: BTItemCategoryService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/itemCategory", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: BTItemCategoryService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/itemCategory/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: BTItemCategoryService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/itemCategory/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

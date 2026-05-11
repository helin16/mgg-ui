import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTItemCategoryService from '../../../services/BudgetTracker/BTItemCategoryService';

describe('BTItemCategoryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: BTItemCategoryService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/bt/itemCategory"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: BTItemCategoryService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/bt/itemCategory"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: BTItemCategoryService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/bt/itemCategory"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: BTItemCategoryService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/bt/itemCategory"),
  });
});

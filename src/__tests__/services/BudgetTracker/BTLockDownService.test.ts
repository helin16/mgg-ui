import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTLockDownService from '../../../services/BudgetTracker/BTLockDownService';

describe('BTLockDownService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: BTLockDownService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/lockDown", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: BTLockDownService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/bt/lockDown", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

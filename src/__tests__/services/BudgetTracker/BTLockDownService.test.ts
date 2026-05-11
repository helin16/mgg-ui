import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTLockDownService from '../../../services/BudgetTracker/BTLockDownService';

describe('BTLockDownService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: BTLockDownService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/bt/lockDown"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: BTLockDownService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/bt/lockDown"),
  });
});

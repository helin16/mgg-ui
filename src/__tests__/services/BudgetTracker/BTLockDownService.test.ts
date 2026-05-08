import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTLockDownService from '../../../services/BudgetTracker/BTLockDownService';

describe('BTLockDownService', () => {
  const endPoint = '/bt/lockDown';

  ServiceTestHelper.testGetAll(endPoint, BTLockDownService.getAll);
  ServiceTestHelper.testCreate(endPoint, BTLockDownService.create);
});

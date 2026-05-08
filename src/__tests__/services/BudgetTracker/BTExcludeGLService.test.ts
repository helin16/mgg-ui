import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTExcludeGLService from '../../../services/BudgetTracker/BTExcludeGLService';

describe('BTExcludeGLService', () => {
  const endPoint = '/bt/glExcludeCodes';

  ServiceTestHelper.testGetAll(endPoint, BTExcludeGLService.getAll);
  ServiceTestHelper.testCreate(endPoint, BTExcludeGLService.create);
  ServiceTestHelper.testDeactivate(endPoint, BTExcludeGLService.deactivate);
});

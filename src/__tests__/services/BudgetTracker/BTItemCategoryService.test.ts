import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTItemCategoryService from '../../../services/BudgetTracker/BTItemCategoryService';

describe('BTItemCategoryService', () => {
  const endPoint = '/bt/itemCategory';

  ServiceTestHelper.testGetAll(endPoint, BTItemCategoryService.getAll);
  ServiceTestHelper.testCreate(endPoint, BTItemCategoryService.create);
  ServiceTestHelper.testUpdate(endPoint, BTItemCategoryService.update);
  ServiceTestHelper.testDeactivate(endPoint, BTItemCategoryService.deactivate);
});

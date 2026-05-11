import ServiceTestHelper from '../../helper/ServiceTestHelper';
import BTExcludeGLService from '../../../services/BudgetTracker/BTExcludeGLService';

describe('BTExcludeGLService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: BTExcludeGLService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/bt/glExcludeCodes"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: BTExcludeGLService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/bt/glExcludeCodes"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: BTExcludeGLService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/bt/glExcludeCodes"),
  });
});

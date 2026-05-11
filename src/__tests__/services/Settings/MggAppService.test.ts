import ServiceTestHelper from '../../helper/ServiceTestHelper';
import MggAppService from '../../../services/Settings/MggAppService';

describe('MggAppService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: MggAppService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/app"),
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: MggAppService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/app"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: MggAppService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/app"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: MggAppService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/app"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: MggAppService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/app"),
  });
});

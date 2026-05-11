import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayService from '../../../services/CampusDisplay/CampusDisplayService';

describe('CampusDisplayService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: CampusDisplayService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/campusDisplay"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: CampusDisplayService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/campusDisplay"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: CampusDisplayService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplay"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: CampusDisplayService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplay"),
  });
});

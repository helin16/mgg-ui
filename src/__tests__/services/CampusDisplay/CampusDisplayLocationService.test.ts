import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayLocationService from '../../../services/CampusDisplay/CampusDisplayLocationService';

describe('CampusDisplayLocationService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: CampusDisplayLocationService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/campusDisplayLocation"),
  });
  ServiceTestHelper.testCustom({
    name: 'getById',
    serviceFn: CampusDisplayLocationService.getById,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplayLocation"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: CampusDisplayLocationService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/campusDisplayLocation"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: CampusDisplayLocationService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplayLocation"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: CampusDisplayLocationService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplayLocation"),
  });
});

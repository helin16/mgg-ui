import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayScheduleService from '../../../services/CampusDisplay/CampusDisplayScheduleService';

describe('CampusDisplayScheduleService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: CampusDisplayScheduleService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/campusDisplaySchedule"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: CampusDisplayScheduleService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/campusDisplaySchedule"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: CampusDisplayScheduleService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplaySchedule"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: CampusDisplayScheduleService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplaySchedule"),
  });
});

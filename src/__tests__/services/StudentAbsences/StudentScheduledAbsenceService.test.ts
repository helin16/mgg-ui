import ServiceTestHelper from '../../helper/ServiceTestHelper';
import StudentScheduledAbsenceService from '../../../services/StudentAbsences/StudentScheduledAbsenceService';

describe('StudentScheduledAbsenceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: StudentScheduledAbsenceService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/studentAbsenceSchedule"),
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: StudentScheduledAbsenceService.get,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/studentAbsenceSchedule"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: StudentScheduledAbsenceService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/studentAbsenceSchedule"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: StudentScheduledAbsenceService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/studentAbsenceSchedule"),
  });
  ServiceTestHelper.testCustom({
    name: 'remove',
    serviceFn: StudentScheduledAbsenceService.remove,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/studentAbsenceSchedule"),
  });
});

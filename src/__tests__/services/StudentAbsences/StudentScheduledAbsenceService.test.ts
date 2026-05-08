import ServiceTestHelper from '../../helper/ServiceTestHelper';
import StudentScheduledAbsenceService from '../../../services/StudentAbsences/StudentScheduledAbsenceService';

describe('StudentScheduledAbsenceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: StudentScheduledAbsenceService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/studentAbsenceSchedule", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'get',
    serviceFn: StudentScheduledAbsenceService.get,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/studentAbsenceSchedule/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: StudentScheduledAbsenceService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/studentAbsenceSchedule", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: StudentScheduledAbsenceService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/studentAbsenceSchedule/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'remove',
    serviceFn: StudentScheduledAbsenceService.remove,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/studentAbsenceSchedule/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

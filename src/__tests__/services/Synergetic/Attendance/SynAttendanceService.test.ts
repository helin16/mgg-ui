import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynAttendanceService from '../../../../services/Synergetic/Attendance/SynAttendanceService';

describe('SynAttendanceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynAttendanceService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/attendance", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: SynAttendanceService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/attendance/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

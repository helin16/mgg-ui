import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentAttendanceHistoryService from '../../../../services/Synergetic/Attendance/SynVStudentAttendanceHistoryService';

describe('SynVStudentAttendanceHistoryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentAttendanceHistoryService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vStudentAttendanceHistory", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

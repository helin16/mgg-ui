import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentAttendanceHistoryService from '../../../../services/Synergetic/Attendance/SynVStudentAttendanceHistoryService';

describe('SynVStudentAttendanceHistoryService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVStudentAttendanceHistoryService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vStudentAttendanceHistory"),
  });
});

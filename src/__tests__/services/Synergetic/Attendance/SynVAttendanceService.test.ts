import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVAttendanceService from '../../../../services/Synergetic/Attendance/SynVAttendanceService';

describe('SynVAttendanceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVAttendanceService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vAttendance"),
  });
});

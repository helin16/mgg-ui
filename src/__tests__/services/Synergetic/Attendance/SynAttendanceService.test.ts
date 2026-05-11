import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynAttendanceService from '../../../../services/Synergetic/Attendance/SynAttendanceService';

describe('SynAttendanceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynAttendanceService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/attendance"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: SynAttendanceService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/syn/attendance"),
  });
});

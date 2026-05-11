import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynAttendanceMasterService from '../../../../services/Synergetic/Attendance/SynAttendanceMasterService';

describe('SynAttendanceMasterService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynAttendanceMasterService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/attendanceMaster"),
  });
});

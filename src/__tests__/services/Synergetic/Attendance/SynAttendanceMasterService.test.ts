import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynAttendanceMasterService from '../../../../services/Synergetic/Attendance/SynAttendanceMasterService';

describe('SynAttendanceMasterService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynAttendanceMasterService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/attendanceMaster", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVAttendanceService from '../../../../services/Synergetic/Attendance/SynVAttendanceService';

describe('SynVAttendanceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVAttendanceService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/syn/vAttendance", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

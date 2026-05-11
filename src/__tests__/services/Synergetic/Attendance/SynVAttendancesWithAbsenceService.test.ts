import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVAttendancesWithAbsenceService from '../../../../services/Synergetic/Attendance/SynVAttendancesWithAbsenceService';

describe('SynVAttendancesWithAbsenceService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: SynVAttendancesWithAbsenceService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/syn/vAttendancesWithAbsence"),
  });
});

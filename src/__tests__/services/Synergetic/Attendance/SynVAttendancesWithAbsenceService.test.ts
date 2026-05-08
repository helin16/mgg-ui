import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVAttendancesWithAbsenceService from '../../../../services/Synergetic/Attendance/SynVAttendancesWithAbsenceService';

describe('SynVAttendancesWithAbsenceService', () => {
  const endPoint = '/syn/vAttendancesWithAbsence';

  ServiceTestHelper.testGetAll(endPoint, SynVAttendancesWithAbsenceService.getAll);
});

import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVAttendanceService from '../../../../services/Synergetic/Attendance/SynVAttendanceService';

describe('SynVAttendanceService', () => {
  const endPoint = '/syn/vAttendance';

  ServiceTestHelper.testGetAll(endPoint, SynVAttendanceService.getAll);
});

import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynAttendanceService from '../../../../services/Synergetic/Attendance/SynAttendanceService';

describe('SynAttendanceService', () => {
  const endPoint = '/syn/attendance';

  ServiceTestHelper.testGetAll(endPoint, SynAttendanceService.getAll);
  ServiceTestHelper.testUpdate(endPoint, SynAttendanceService.update);
});

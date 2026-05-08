import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynVStudentAttendanceHistoryService from '../../../../services/Synergetic/Attendance/SynVStudentAttendanceHistoryService';

describe('SynVStudentAttendanceHistoryService', () => {
  const endPoint = '/syn/vStudentAttendanceHistory';

  ServiceTestHelper.testGetAll(endPoint, SynVStudentAttendanceHistoryService.getAll);
});

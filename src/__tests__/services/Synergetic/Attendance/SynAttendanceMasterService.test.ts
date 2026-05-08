import ServiceTestHelper from '../../../helper/ServiceTestHelper';
import SynAttendanceMasterService from '../../../../services/Synergetic/Attendance/SynAttendanceMasterService';

describe('SynAttendanceMasterService', () => {
  const endPoint = '/syn/attendanceMaster';

  ServiceTestHelper.testGetAll(endPoint, SynAttendanceMasterService.getAll);
});

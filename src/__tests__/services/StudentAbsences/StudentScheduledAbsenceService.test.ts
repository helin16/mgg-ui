import ServiceTestHelper from '../../helper/ServiceTestHelper';
import StudentScheduledAbsenceService from '../../../services/StudentAbsences/StudentScheduledAbsenceService';

describe('StudentScheduledAbsenceService', () => {
  const endPoint = '/studentAbsenceSchedule';

  ServiceTestHelper.testGetAll(endPoint, StudentScheduledAbsenceService.getAll);
  ServiceTestHelper.testGet(endPoint, StudentScheduledAbsenceService.get);
  ServiceTestHelper.testCreate(endPoint, StudentScheduledAbsenceService.create);
  ServiceTestHelper.testUpdate(endPoint, StudentScheduledAbsenceService.update);
  ServiceTestHelper.testDeactivate(endPoint, StudentScheduledAbsenceService.remove);
});

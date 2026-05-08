import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayScheduleService from '../../../services/CampusDisplay/CampusDisplayScheduleService';

describe('CampusDisplayScheduleService', () => {
  const endPoint = '/campusDisplaySchedule';

  ServiceTestHelper.testGetAll(endPoint, CampusDisplayScheduleService.getAll);
  ServiceTestHelper.testCreate(endPoint, CampusDisplayScheduleService.create);
  ServiceTestHelper.testUpdate(endPoint, CampusDisplayScheduleService.update);
  ServiceTestHelper.testDeactivate(endPoint, CampusDisplayScheduleService.deactivate);
});

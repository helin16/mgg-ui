import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardEventTypeService from '../../../services/HouseAwards/HouseAwardEventTypeService';

describe('HouseAwardEventTypeService', () => {
  const endPoint = '/houseAwards/eventType';

  ServiceTestHelper.testGetAll(endPoint, HouseAwardEventTypeService.getEventTypes);
  ServiceTestHelper.testGet(endPoint, HouseAwardEventTypeService.getEventType);
  ServiceTestHelper.testCreate(endPoint, HouseAwardEventTypeService.createEventType);
  ServiceTestHelper.testUpdate(endPoint, HouseAwardEventTypeService.updateEventType);
  ServiceTestHelper.testDeactivate(endPoint, HouseAwardEventTypeService.deleteEventType);
});

import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardEventTypeService from '../../../services/HouseAwards/HouseAwardEventTypeService';

describe('HouseAwardEventTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getEventTypes',
    serviceFn: HouseAwardEventTypeService.getEventTypes,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/houseAwards/eventType"),
  });
  ServiceTestHelper.testCustom({
    name: 'getEventType',
    serviceFn: HouseAwardEventTypeService.getEventType,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/houseAwards/eventType"),
  });
  ServiceTestHelper.testCustom({
    name: 'createEventType',
    serviceFn: HouseAwardEventTypeService.createEventType,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/houseAwards/eventType"),
  });
  ServiceTestHelper.testCustom({
    name: 'updateEventType',
    serviceFn: HouseAwardEventTypeService.updateEventType,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/houseAwards/eventType"),
  });
  ServiceTestHelper.testCustom({
    name: 'deleteEventType',
    serviceFn: HouseAwardEventTypeService.deleteEventType,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/houseAwards/eventType"),
  });
});

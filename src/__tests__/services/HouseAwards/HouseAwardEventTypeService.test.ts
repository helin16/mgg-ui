import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardEventTypeService from '../../../services/HouseAwards/HouseAwardEventTypeService';

describe('HouseAwardEventTypeService', () => {
  ServiceTestHelper.testCustom({
    name: 'getEventTypes',
    serviceFn: HouseAwardEventTypeService.getEventTypes,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/eventType", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getEventType',
    serviceFn: HouseAwardEventTypeService.getEventType,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/eventType/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'createEventType',
    serviceFn: HouseAwardEventTypeService.createEventType,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/eventType", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'updateEventType',
    serviceFn: HouseAwardEventTypeService.updateEventType,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/eventType/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deleteEventType',
    serviceFn: HouseAwardEventTypeService.deleteEventType,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/houseAwards/eventType/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

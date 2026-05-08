import ServiceTestHelper from '../../helper/ServiceTestHelper';
import HouseAwardEventService from '../../../services/HouseAwards/HouseAwardEventService';

describe('HouseAwardEventService', () => {
  const endPoint = '/houseAwards/event';

  ServiceTestHelper.testCustom({
    name: 'getEvents',
    serviceFn: HouseAwardEventService.getEvents,
    appMethod: 'get',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [endPoint, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getEvent',
    serviceFn: HouseAwardEventService.getEvent,
    appMethod: 'get',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'createEvent',
    serviceFn: HouseAwardEventService.createEvent,
    appMethod: 'post',
    callArgs: [{fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [endPoint, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'updateEvent',
    serviceFn: HouseAwardEventService.updateEvent,
    appMethod: 'put',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deleteEvent',
    serviceFn: HouseAwardEventService.deleteEvent,
    appMethod: 'delete',
    callArgs: ['123', {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
    expectedArgs: [`${endPoint}/123`, {fakeParams: 'value'}, {headers: {fakeConfig: 'value'}}],
  });
});

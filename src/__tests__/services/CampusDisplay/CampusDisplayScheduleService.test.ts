import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayScheduleService from '../../../services/CampusDisplay/CampusDisplayScheduleService';

describe('CampusDisplayScheduleService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: CampusDisplayScheduleService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySchedule", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: CampusDisplayScheduleService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySchedule", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: CampusDisplayScheduleService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySchedule/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: CampusDisplayScheduleService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySchedule/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayService from '../../../services/CampusDisplay/CampusDisplayService';

describe('CampusDisplayService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: CampusDisplayService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplay", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: CampusDisplayService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplay", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: CampusDisplayService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplay/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: CampusDisplayService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplay/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

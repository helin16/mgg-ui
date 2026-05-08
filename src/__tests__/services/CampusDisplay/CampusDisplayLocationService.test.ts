import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplayLocationService from '../../../services/CampusDisplay/CampusDisplayLocationService';

describe('CampusDisplayLocationService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: CampusDisplayLocationService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplayLocation", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getById',
    serviceFn: CampusDisplayLocationService.getById,
    appMethod: 'get',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplayLocation/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: CampusDisplayLocationService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplayLocation", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: CampusDisplayLocationService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplayLocation/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: CampusDisplayLocationService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplayLocation/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

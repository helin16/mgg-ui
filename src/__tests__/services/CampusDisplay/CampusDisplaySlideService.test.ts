import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplaySlideService from '../../../services/CampusDisplay/CampusDisplaySlideService';

describe('CampusDisplaySlideService', () => {
  ServiceTestHelper.testCustom({
    name: 'createFromFolder',
    serviceFn: CampusDisplaySlideService.createFromFolder,
    appMethod: 'post',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySlide/folder/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: CampusDisplaySlideService.getAll,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySlide", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: CampusDisplaySlideService.create,
    appMethod: 'post',
    callArgs: [{"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySlide", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: CampusDisplaySlideService.update,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySlide/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'upload',
    serviceFn: CampusDisplaySlideService.upload,
    appMethod: 'post',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySlide/upload/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: CampusDisplaySlideService.deactivate,
    appMethod: 'delete',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySlide/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
});

import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplaySlideService from '../../../services/CampusDisplay/CampusDisplaySlideService';

describe('CampusDisplaySlideService', () => {
  const endPoint = '/campusDisplaySlide';

  ServiceTestHelper.testCustom({
    name: 'createFromFolder',
    serviceFn: CampusDisplaySlideService.createFromFolder,
    appMethod: 'post',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySlide/folder/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testGetAll(endPoint, CampusDisplaySlideService.getAll);
  ServiceTestHelper.testCreate(endPoint, CampusDisplaySlideService.create);
  ServiceTestHelper.testUpdate(endPoint, CampusDisplaySlideService.update);
  ServiceTestHelper.testCustom({
    name: 'upload',
    serviceFn: CampusDisplaySlideService.upload,
    appMethod: 'post',
    callArgs: ["123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
    expectedArgs: ["/campusDisplaySlide/upload/123", {"fakeParams":"value"}, {"headers":{"fakeConfig":"value"}}],
  });
  ServiceTestHelper.testDeactivate(endPoint, CampusDisplaySlideService.deactivate);
});

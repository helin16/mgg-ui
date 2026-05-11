import ServiceTestHelper from '../../helper/ServiceTestHelper';
import CampusDisplaySlideService from '../../../services/CampusDisplay/CampusDisplaySlideService';

describe('CampusDisplaySlideService', () => {
  ServiceTestHelper.testCustom({
    name: 'createFromFolder',
    serviceFn: CampusDisplaySlideService.createFromFolder,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplaySlide/folder"),
  });
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: CampusDisplaySlideService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/campusDisplaySlide"),
  });
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: CampusDisplaySlideService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/campusDisplaySlide"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: CampusDisplaySlideService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplaySlide"),
  });
  ServiceTestHelper.testCustom({
    name: 'upload',
    serviceFn: CampusDisplaySlideService.upload,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplaySlide/upload"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: CampusDisplaySlideService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/campusDisplaySlide"),
  });
});

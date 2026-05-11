import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetFolderService from '../../../services/Asset/AssetFolderService';

describe('AssetFolderService', () => {
  ServiceTestHelper.testCustom({
    name: 'create',
    serviceFn: AssetFolderService.create,
    appMethod: 'post',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/assetFolder"),
  });
  ServiceTestHelper.testCustom({
    name: 'update',
    serviceFn: AssetFolderService.update,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/assetFolder"),
  });
  ServiceTestHelper.testCustom({
    name: 'getAll',
    serviceFn: AssetFolderService.getAll,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getCallArgs(),
    expectedArgs: ServiceTestHelper.getExpectedArgs("/assetFolder"),
  });
  ServiceTestHelper.testCustom({
    name: 'deactivate',
    serviceFn: AssetFolderService.deactivate,
    appMethod: 'delete',
    callArgs: ServiceTestHelper.getCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getExpectedArgsWithId("/assetFolder"),
  });
});

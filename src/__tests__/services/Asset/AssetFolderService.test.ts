import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetFolderService from '../../../services/Asset/AssetFolderService';

describe('AssetFolderService', () => {
  const endPoint = '/assetFolder';

  ServiceTestHelper.testCreate(endPoint, AssetFolderService.create);
  ServiceTestHelper.testUpdate(endPoint, AssetFolderService.update);
  ServiceTestHelper.testGetAll(endPoint, AssetFolderService.getAll);
  ServiceTestHelper.testDeactivate(endPoint, AssetFolderService.deactivate);
});

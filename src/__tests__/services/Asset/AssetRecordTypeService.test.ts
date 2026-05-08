import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetRecordTypeService from '../../../services/Asset/AssetRecordTypeService';

describe('AssetRecordTypeService', () => {
  const endPoint = '/assetRecordType';

  ServiceTestHelper.testGetAll(endPoint, AssetRecordTypeService.getAll);
  ServiceTestHelper.testGet(endPoint, AssetRecordTypeService.get);
});

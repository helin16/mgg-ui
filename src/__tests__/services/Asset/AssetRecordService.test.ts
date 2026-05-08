import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetRecordService from '../../../services/Asset/AssetRecordService';

describe('AssetRecordService', () => {
  const endPoint = '/assetRecord';

  ServiceTestHelper.testGetAll(endPoint, AssetRecordService.getAssetRecords);
  ServiceTestHelper.testCustom({
    name: 'pickup',
    serviceFn: AssetRecordService.pickup,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/assetRecord/123/pickup", {"fakeParams":"value"}],
  });
});

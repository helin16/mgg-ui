import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetRecordService from '../../../services/Asset/AssetRecordService';

describe('AssetRecordService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAssetRecords',
    serviceFn: AssetRecordService.getAssetRecords,
    appMethod: 'get',
    callArgs: [{"fakeParams":"value"}],
    expectedArgs: ["/assetRecord", {"fakeParams":"value"}],
  });
  ServiceTestHelper.testCustom({
    name: 'pickup',
    serviceFn: AssetRecordService.pickup,
    appMethod: 'put',
    callArgs: ["123", {"fakeParams":"value"}],
    expectedArgs: ["/assetRecord/123/pickup", {"fakeParams":"value"}],
  });
});

import ServiceTestHelper from '../../helper/ServiceTestHelper';
import AssetRecordService from '../../../services/Asset/AssetRecordService';

describe('AssetRecordService', () => {
  ServiceTestHelper.testCustom({
    name: 'getAssetRecords',
    serviceFn: AssetRecordService.getAssetRecords,
    appMethod: 'get',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgs(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgs("/assetRecord"),
  });
  ServiceTestHelper.testCustom({
    name: 'pickup',
    serviceFn: AssetRecordService.pickup,
    appMethod: 'put',
    callArgs: ServiceTestHelper.getParamsOnlyCallArgsWithId(),
    expectedArgs: ServiceTestHelper.getParamsOnlyExpectedArgsWithIdAndSuffix('/assetRecord', 'pickup'),
  });
});
